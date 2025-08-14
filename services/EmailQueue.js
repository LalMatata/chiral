import { prepare } from '../database/db.js';
import { Resend } from 'resend';
import cron from 'node-cron';

class EmailQueue {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.isProcessing = false;
    this.maxAttempts = 3;
    this.retryDelays = [5 * 60 * 1000, 30 * 60 * 1000, 2 * 60 * 60 * 1000]; // 5min, 30min, 2hour
  }

  static create(data) {
    const stmt = prepare(`
      INSERT INTO email_queue (
        lead_id, recipient, subject, template, data
      ) VALUES (
        @lead_id, @recipient, @subject, @template, @data
      )
    `);
    
    const info = stmt.run({
      lead_id: data.leadId || null,
      recipient: data.recipient,
      subject: data.subject,
      template: data.template,
      data: JSON.stringify(data.data || {})
    });
    
    return this.findById(info.lastInsertRowid);
  }

  static findById(id) {
    const stmt = prepare('SELECT * FROM email_queue WHERE id = ?');
    return stmt.get(id);
  }

  static findPending() {
    const stmt = prepare(`
      SELECT * FROM email_queue 
      WHERE status = 'pending' 
        AND attempts < @maxAttempts
        AND (last_attempt IS NULL OR last_attempt <= datetime('now', '-5 minutes'))
      ORDER BY created_at ASC
    `);
    return stmt.all({ maxAttempts: this.maxAttempts });
  }

  static updateStatus(id, status, error = null, sentAt = null) {
    const stmt = prepare(`
      UPDATE email_queue 
      SET status = @status,
          error = @error,
          sent_at = @sent_at,
          attempts = attempts + 1,
          last_attempt = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    
    stmt.run({ id, status, error, sent_at: sentAt || null });
  }

  static markSent(id) {
    const stmt = prepare(`
      UPDATE email_queue 
      SET status = 'sent',
          sent_at = CURRENT_TIMESTAMP,
          attempts = attempts + 1,
          last_attempt = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    
    stmt.run({ id });
  }

  static markFailed(id, error) {
    const stmt = prepare(`
      UPDATE email_queue 
      SET status = 'failed',
          error = @error,
          attempts = attempts + 1,
          last_attempt = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    
    stmt.run({ id, error });
  }

  async processQueue() {
    if (this.isProcessing || !process.env.RESEND_API_KEY) return;
    
    this.isProcessing = true;
    
    try {
      const pendingEmails = EmailQueue.findPending();
      
      for (const email of pendingEmails) {
        try {
          const emailData = JSON.parse(email.data || '{}');
          
          await this.resend.emails.send({
            from: process.env.FROM_EMAIL || 'CHIRAL <noreply@chiral-robotics.com>',
            to: email.recipient,
            subject: email.subject,
            html: this.renderTemplate(email.template, emailData),
            text: this.renderTextTemplate(email.template, emailData)
          });
          
          EmailQueue.markSent(email.id);
          console.log(`Email sent successfully: ${email.id} to ${email.recipient}`);
          
        } catch (error) {
          console.error(`Failed to send email ${email.id}:`, error);
          
          if (email.attempts >= this.maxAttempts - 1) {
            EmailQueue.markFailed(email.id, error.message);
          } else {
            EmailQueue.updateStatus(email.id, 'pending', error.message);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error('Error processing email queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  renderTemplate(template, data) {
    switch (template) {
      case 'welcome':
        return this.getWelcomeTemplate(data);
      case 'lead_notification':
        return this.getLeadNotificationTemplate(data);
      case 'follow_up_reminder':
        return this.getFollowUpReminderTemplate(data);
      case 'demo_confirmation':
        return this.getDemoConfirmationTemplate(data);
      case 'quote_follow_up':
        return this.getQuoteFollowUpTemplate(data);
      default:
        return data.htmlContent || '';
    }
  }

  renderTextTemplate(template, data) {
    switch (template) {
      case 'welcome':
        return this.getWelcomeTextTemplate(data);
      case 'lead_notification':
        return this.getLeadNotificationTextTemplate(data);
      default:
        return data.textContent || '';
    }
  }

  getWelcomeTemplate(data) {
    return `
      <h2>Thank you for contacting CHIRAL Robotics</h2>
      
      <p>Dear ${data.contactPerson},</p>
      
      <p>We have received your ${data.inquiryType} and appreciate your interest in CHIRAL's advanced robotics solutions.</p>
      
      <p>Our team will review your requirements and contact you within 24 hours to discuss how we can help address your operational needs.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Inquiry Details:</h3>
        <ul>
          <li><strong>Company:</strong> ${data.companyName}</li>
          <li><strong>Industry:</strong> ${data.industry || 'Not specified'}</li>
          <li><strong>Inquiry Type:</strong> ${data.inquiryType}</li>
          ${data.budget ? `<li><strong>Budget:</strong> ${data.budget}</li>` : ''}
          ${data.timeline ? `<li><strong>Timeline:</strong> ${data.timeline}</li>` : ''}
        </ul>
      </div>
      
      <p>While you wait, you can:</p>
      <ul>
        <li><a href="https://chiral-robotics.com/products">Browse our product catalog</a></li>
        <li><a href="https://chiral-robotics.com/applications">Review our applications and case studies</a></li>
        <li><a href="https://chiral-robotics.com/about">Learn more about our company</a></li>
      </ul>
      
      <p>If you have any urgent questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>
      The CHIRAL Team</p>
      
      <hr>
      <p style="font-size: 12px; color: #6c757d;">
        CHIRAL Robotics Solutions Ltd.<br>
        Advanced Industrial Robotics<br>
        www.chiral-robotics.com
      </p>
    `;
  }

  getWelcomeTextTemplate(data) {
    return `Thank you for contacting CHIRAL Robotics

Dear ${data.contactPerson},

We have received your ${data.inquiryType} and appreciate your interest in CHIRAL's advanced robotics solutions.

Our team will review your requirements and contact you within 24 hours to discuss how we can help address your operational needs.

Your Inquiry Details:
- Company: ${data.companyName}
- Industry: ${data.industry || 'Not specified'}
- Inquiry Type: ${data.inquiryType}
${data.budget ? `- Budget: ${data.budget}` : ''}
${data.timeline ? `- Timeline: ${data.timeline}` : ''}

While you wait, you can browse our product catalog and case studies at www.chiral-robotics.com

Best regards,
The CHIRAL Team

CHIRAL Robotics Solutions Ltd.
Advanced Industrial Robotics
www.chiral-robotics.com`;
  }

  getLeadNotificationTemplate(data) {
    const isDemo = data.inquiryType === 'demo';
    const isQuote = data.inquiryType === 'quote';
    const title = isDemo ? 'Demo Request' : isQuote ? 'Quote Request' : 'New Lead';
    
    return `
      <h2>🚨 New ${title} Alert</h2>
      
      <div style="background-color: ${isDemo ? '#e7f3ff' : isQuote ? '#fff3cd' : '#f8f9fa'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Lead Information</h3>
        <ul>
          <li><strong>Company:</strong> ${data.companyName}</li>
          <li><strong>Contact:</strong> ${data.contactPerson}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
          <li><strong>Industry:</strong> ${data.industry || 'Not specified'}</li>
          <li><strong>Source:</strong> ${data.source || 'Direct'}</li>
          <li><strong>Lead Score:</strong> ${data.score || 0}/100</li>
        </ul>
      </div>
      
      ${data.message ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
          <strong>Message:</strong><br>
          ${data.message}
        </div>
      ` : ''}
      
      ${data.requirements ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
          <strong>Requirements:</strong><br>
          ${data.requirements}
        </div>
      ` : ''}
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>Recommended Actions:</strong>
        <ul>
          <li>Contact within 2 hours for maximum conversion</li>
          <li>Prepare relevant product materials</li>
          ${isDemo ? '<li>Schedule demo session within 48 hours</li>' : ''}
          ${isQuote ? '<li>Gather detailed requirements and prepare quote</li>' : ''}
          <li>Update lead status in CRM</li>
        </ul>
      </div>
      
      <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
      
      <p style="color: #dc3545;"><strong>⏰ Time is critical - follow up immediately!</strong></p>
    `;
  }

  getLeadNotificationTextTemplate(data) {
    const isDemo = data.inquiryType === 'demo';
    const title = isDemo ? 'Demo Request' : 'New Lead';
    
    return `🚨 New ${title} Alert

Lead Information:
- Company: ${data.companyName}
- Contact: ${data.contactPerson}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Industry: ${data.industry || 'Not specified'}
- Source: ${data.source || 'Direct'}
- Lead Score: ${data.score || 0}/100

${data.message ? `Message: ${data.message}` : ''}

${data.requirements ? `Requirements: ${data.requirements}` : ''}

Recommended Actions:
- Contact within 2 hours for maximum conversion
- Prepare relevant product materials
${isDemo ? '- Schedule demo session within 48 hours' : ''}
- Update lead status in CRM

Received: ${new Date().toLocaleString()}

⏰ Time is critical - follow up immediately!`;
  }

  getDemoConfirmationTemplate(data) {
    return `
      <h2>Demo Session Confirmed</h2>
      
      <p>Dear ${data.contactPerson},</p>
      
      <p>Your demo session has been confirmed! We're excited to show you how CHIRAL's robotics solutions can transform your operations.</p>
      
      <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Demo Details:</h3>
        <ul>
          <li><strong>Date & Time:</strong> ${data.demoDateTime}</li>
          <li><strong>Duration:</strong> ${data.duration || '60 minutes'}</li>
          <li><strong>Location:</strong> ${data.location || 'Virtual/Online'}</li>
          <li><strong>Demo Lead:</strong> ${data.demoLead || 'CHIRAL Sales Team'}</li>
        </ul>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What to Expect:</h3>
        <ul>
          <li>Live demonstration of relevant robotics capabilities</li>
          <li>Discussion of your specific use cases and requirements</li>
          <li>Q&A session with our technical experts</li>
          <li>Next steps and implementation roadmap</li>
        </ul>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>To Prepare:</strong>
        <ul>
          <li>Prepare specific questions about your operational challenges</li>
          <li>Gather information about your current processes</li>
          <li>Invite relevant stakeholders and decision-makers</li>
        </ul>
      </div>
      
      ${data.joinLink ? `
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3>Join the Demo</h3>
          <a href="${data.joinLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Click to Join Demo</a>
          <p style="margin-top: 10px; font-size: 14px;">Or copy this link: ${data.joinLink}</p>
        </div>
      ` : ''}
      
      <p>If you need to reschedule or have any questions, please contact us immediately.</p>
      
      <p>Looking forward to demonstrating the future of robotics!</p>
      
      <p>Best regards,<br>
      The CHIRAL Demo Team</p>
    `;
  }

  getFollowUpReminderTemplate(data) {
    return `
      <h2>Follow-up Reminder: ${data.companyName}</h2>
      
      <p>This is a reminder to follow up with:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <ul>
          <li><strong>Company:</strong> ${data.companyName}</li>
          <li><strong>Contact:</strong> ${data.contactPerson}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
          <li><strong>Last Contact:</strong> ${data.lastContact}</li>
          <li><strong>Status:</strong> ${data.status}</li>
        </ul>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>Action Required:</strong> ${data.action}
      </div>
      
      ${data.notes ? `
        <div style="background-color: #e2e3e5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Previous Notes:</strong><br>
          ${data.notes}
        </div>
      ` : ''}
      
      <p><strong>Scheduled For:</strong> ${data.scheduledFor}</p>
    `;
  }

  getQuoteFollowUpTemplate(data) {
    return `
      <h2>Quote Follow-up</h2>
      
      <p>Dear ${data.contactPerson},</p>
      
      <p>I hope this email finds you well. I wanted to follow up on the quote we provided for your robotics solution on ${data.quoteDate}.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Quote Summary:</h3>
        <ul>
          <li><strong>Quote #:</strong> ${data.quoteNumber}</li>
          <li><strong>Solution:</strong> ${data.solution}</li>
          <li><strong>Value:</strong> ${data.quoteValue}</li>
          <li><strong>Valid Until:</strong> ${data.validUntil}</li>
        </ul>
      </div>
      
      <p>Do you have any questions about our proposal? I'm happy to schedule a call to discuss:</p>
      <ul>
        <li>Technical specifications and capabilities</li>
        <li>Implementation timeline and support</li>
        <li>Customization options for your specific needs</li>
        <li>Training and maintenance programs</li>
      </ul>
      
      <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3>Ready to Move Forward?</h3>
        <p>Let's schedule a call to discuss the next steps.</p>
        <a href="${data.schedulingLink || 'https://calendly.com/chiral-robotics'}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Schedule a Call</a>
      </div>
      
      <p>Thank you for considering CHIRAL Robotics for your automation needs.</p>
      
      <p>Best regards,<br>
      ${data.salesRep || 'CHIRAL Sales Team'}</p>
    `;
  }

  startCronJobs() {
    cron.schedule('*/5 * * * *', () => {
      this.processQueue();
    });
    
    console.log('Email queue cron job started - processing every 5 minutes');
  }

  getQueueStatistics() {
    const stats = prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM email_queue
      GROUP BY status
    `).all();

    const recent = prepare(`
      SELECT 
        COUNT(*) as count
      FROM email_queue
      WHERE created_at >= datetime('now', '-24 hours')
    `).get();

    const failed = prepare(`
      SELECT 
        COUNT(*) as count
      FROM email_queue
      WHERE status = 'failed'
        AND created_at >= datetime('now', '-7 days')
    `).get();

    return {
      by_status: stats,
      last_24h: recent.count,
      failed_last_week: failed.count
    };
  }
}

export default EmailQueue;