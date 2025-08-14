import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import './database/db.js';
import Lead from './database/models/Lead.js';
import FollowUp from './database/models/FollowUp.js';
import EmailQueue from './services/EmailQueue.js';
import Auth from './middleware/auth.js';
import { 
  sendErrorResponse, 
  globalErrorHandler, 
  asyncHandler, 
  notFoundHandler,
  validateRequest,
  handleDatabaseError,
  handleEmailError,
  ChiralServerError,
  ERROR_TYPES 
} from './utils/serverErrorHandler.js';

import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Initialize services
const resend = new Resend(process.env.RESEND_API_KEY);
const emailQueue = new EmailQueue();

// Initialize default admin user
Auth.initializeDefaultUser();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for contact form
const contactFormAttempts = new Map();
const rateLimitContact = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!contactFormAttempts.has(ip)) {
    contactFormAttempts.set(ip, []);
  }

  const attempts = contactFormAttempts.get(ip);
  const recentAttempts = attempts.filter(time => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      error: 'Too many contact form submissions. Please try again later.'
    });
  }

  recentAttempts.push(now);
  contactFormAttempts.set(ip, recentAttempts);
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Use global error handler
app.use(globalErrorHandler);

// Contact form validation using standardized validator
const validateContactForm = validateRequest({
  companyName: { 
    required: true, 
    type: 'string', 
    minLength: 1, 
    maxLength: 200 
  },
  contactPerson: { 
    required: true, 
    type: 'string', 
    minLength: 1, 
    maxLength: 100 
  },
  email: { 
    required: true, 
    type: 'string', 
    email: true, 
    maxLength: 200 
  },
  formType: { 
    required: true, 
    type: 'string', 
    custom: (value) => ['multi-step-lead', 'demo', 'sales', 'general', 'lead'].includes(value),
    customMessage: 'formType must be one of: multi-step-lead, demo, sales, general, lead'
  },
  phone: { 
    required: false, 
    type: 'string', 
    maxLength: 50 
  },
  message: { 
    required: false, 
    type: 'string', 
    maxLength: 5000 
  }
});

// Newsletter validation middleware
const validateNewsletter = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'  
    });
  }
  
  next();
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'CHIRAL API Server Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/contact - Submit contact form',
      'POST /api/newsletter - Newsletter signup',
      'GET /api/leads - View all leads'
    ]
  });
});

// Status endpoint  
app.get('/status', (req, res) => {
  const leadsCount = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]').length;
  const newsletterFile = path.join(dataDir, 'newsletter.json');
  const newsletterCount = fs.existsSync(newsletterFile) 
    ? JSON.parse(fs.readFileSync(newsletterFile, 'utf8') || '[]').length 
    : 0;
    
  res.json({
    status: 'healthy',
    leads: leadsCount,
    subscribers: newsletterCount,
    emailConfigured: !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here'
  });
});

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Ensure brochures directory exists
const brochuresDir = path.join(uploadsDir, 'brochures');
if (!fs.existsSync(brochuresDir)) {
  fs.mkdirSync(brochuresDir);
}

// Initialize leads file if it doesn't exist
const leadsFile = path.join(dataDir, 'leads.json');
if (!fs.existsSync(leadsFile)) {
  fs.writeFileSync(leadsFile, '[]');
}

// Initialize brochures file if it doesn't exist
const brochuresFile = path.join(dataDir, 'brochures.json');
if (!fs.existsSync(brochuresFile)) {
  fs.writeFileSync(brochuresFile, '[]');
}

// Multer configuration for brochure uploads
const brochureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, brochuresDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

const brochureUpload = multer({
  storage: brochureStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'), false);
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Enhanced Contact form endpoint
app.post('/api/contact', rateLimitContact, validateContactForm, asyncHandler(async (req, res) => {
  const formData = {
    ...req.body,
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    source: req.body.source || req.get('Referer') || 'direct',
    utmSource: req.body.utm_source,
    utmMedium: req.body.utm_medium,
    utmCampaign: req.body.utm_campaign
  };
  
  try {
    // Create lead in database
    const lead = Lead.create(formData);
    
    // Queue emails for processing
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
      try {
        // Queue notification email to sales team
        EmailQueue.create({
          leadId: lead.id,
          recipient: process.env.SALES_EMAIL || 'sales@chiralrobotics.com',
          subject: `🚨 New ${formData.formType === 'demo' ? 'Demo Request' : formData.formType === 'sales' ? 'Sales Inquiry' : 'Lead'}: ${formData.companyName}`,
          template: 'lead_notification',
          data: { ...lead, inquiryType: formData.formType }
        });
        
        // Queue auto-reply to prospect  
        EmailQueue.create({
          leadId: lead.id,
          recipient: formData.email,
          subject: 'Thank you for contacting CHIRAL Robotics',
          template: 'welcome',
          data: { ...lead, inquiryType: formData.formType }
        });

        // Create initial follow-up task
        FollowUp.create({
          leadId: lead.id,
          action: 'Initial contact - respond within 2 hours',
          notes: 'New lead from website contact form',
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
        });
      } catch (emailError) {
        // Log email error but don't fail the request
        console.warn('Email processing failed:', emailError.message);
        throw handleEmailError(emailError, 'queuing emails');
      }
    } else {
      console.log('Resend API key not configured - emails not sent');
      console.log('Lead created:', lead);
    }

    // Emit real-time notification to admin dashboard
    if (io) {
      io.emit('new_lead', {
        lead,
        message: `New ${formData.formType} inquiry from ${formData.companyName}`
      });
    }
    
    res.json({ success: true, message: 'Form submitted successfully', leadId: lead.id });
  } catch (dbError) {
    throw handleDatabaseError(dbError, 'creating lead');
  }
}));

// Newsletter signup endpoint
app.post('/api/newsletter', validateNewsletter, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Store subscriber
    const subscribersFile = path.join(dataDir, 'newsletter.json');
    let subscribers = [];
    
    if (fs.existsSync(subscribersFile)) {
      subscribers = JSON.parse(fs.readFileSync(subscribersFile, 'utf8') || '[]');
    }
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString()
    });
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    
    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error processing newsletter signup:', error);
    res.status(500).json({ success: false, error: 'Failed to process signup' });
  }
});

// Simple admin dashboard page
app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <head><title>CHIRAL Admin Dashboard</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>CHIRAL Email Management System</h1>
        <h2>Quick Actions</h2>
        <p><a href="/api/process-emails">Process Email Queue</a> - Manually trigger email sending</p>
        <p><a href="/api/leads">View All Leads (JSON)</a></p>
        <p><a href="/api/analytics/metrics">Analytics Metrics</a></p>
        <h2>Default Login</h2>
        <p>Username: admin<br>Password: ChiralAdmin123!</p>
      </body>
    </html>
  `);
});

// Manual email processing endpoint
app.get('/api/process-emails', async (req, res) => {
  try {
    await emailQueue.processQueue();
    res.json({ success: true, message: 'Email queue processed' });
  } catch (error) {
    console.error('Error processing email queue:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all leads (protected endpoint - add auth in production)
app.get('/api/leads', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
    res.json(leads);
  } catch (err) {
    console.error('Error retrieving leads:', err);
    res.status(500).json({ error: 'Failed to retrieve leads' });
  }
});

// Analytics metrics endpoint
app.get('/api/analytics/metrics', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
    const newsletterFile = path.join(dataDir, 'newsletter.json');
    const newsletters = JSON.parse(fs.readFileSync(newsletterFile, 'utf8') || '[]');
    
    // Calculate metrics
    const today = new Date().toDateString();
    const todayLeads = leads.filter(lead => new Date(lead.timestamp).toDateString() === today);
    
    // Calculate conversion rate (demo requests / total leads)
    const demoRequests = leads.filter(lead => lead.formType === 'demo');
    const conversionRate = leads.length > 0 ? Math.round((demoRequests.length / leads.length) * 100) : 0;
    
    // Calculate total pipeline value (Israeli Shekels)
    const totalValue = leads.reduce((sum, lead) => {
      if (lead.formType === 'demo') return sum + 5000;
      if (lead.formType === 'quote') return sum + 2500;
      return sum + 1000;
    }, 0);
    
    res.json({
      totalLeads: leads.length,
      todayLeads: todayLeads.length,
      conversionRate,
      totalValue,
      newsletterSubscribers: newsletters.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error calculating metrics:', err);
    res.status(500).json({ error: 'Failed to calculate metrics' });
  }
});

// Lead analytics by source
app.get('/api/analytics/sources', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
    
    // Group leads by source
    const sourceData = leads.reduce((acc, lead) => {
      const source = lead.source || 'direct';
      if (!acc[source]) {
        acc[source] = { count: 0, value: 0 };
      }
      acc[source].count++;
      acc[source].value += lead.formType === 'demo' ? 5000 : 
                          lead.formType === 'quote' ? 2500 : 1000;
      return acc;
    }, {});
    
    // Convert to array format
    const sources = Object.entries(sourceData).map(([name, data]) => ({
      name,
      leads: data.count,
      value: data.value,
      percentage: Math.round((data.count / leads.length) * 100) || 0
    })).sort((a, b) => b.leads - a.leads);
    
    res.json(sources);
  } catch (err) {
    console.error('Error getting source analytics:', err);
    res.status(500).json({ error: 'Failed to get source analytics' });
  }
});

// Daily leads trend
app.get('/api/analytics/trend', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
    
    // Group leads by date for last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const trendData = last30Days.map(date => {
      const dayLeads = leads.filter(lead => 
        lead.timestamp && lead.timestamp.startsWith(date)
      );
      return {
        date,
        leads: dayLeads.length,
        value: dayLeads.reduce((sum, lead) => {
          return sum + (lead.formType === 'demo' ? 5000 : 
                       lead.formType === 'quote' ? 2500 : 1000);
        }, 0)
      };
    });
    
    res.json(trendData);
  } catch (err) {
    console.error('Error getting trend analytics:', err);
    res.status(500).json({ error: 'Failed to get trend analytics' });
  }
});

// Format email to sales team
function formatEmailToSales(formData) {
  const isDemo = formData.formType === 'demo';
  const isLead = formData.formType === 'lead';
  const title = isDemo ? 'Demo Request' : isLead ? 'Lead' : 'Sales Inquiry';
  
  return `
    <h2>New ${title}</h2>
    
    <h3>Contact Information:</h3>
    <ul>
      <li><strong>Company:</strong> ${formData.companyName}</li>
      <li><strong>Contact Person:</strong> ${formData.contactPerson}</li>
      <li><strong>Email:</strong> ${formData.email}</li>
      <li><strong>Phone:</strong> ${formData.phone || 'Not provided'}</li>
      <li><strong>Industry:</strong> ${formData.industry || 'Not specified'}</li>
    </ul>
    
    ${isDemo ? `
      <h3>Demo Details:</h3>
      <ul>
        <li><strong>Application Interest:</strong> ${formData.application || 'Not specified'}</li>
        <li><strong>Number of Attendees:</strong> ${formData.attendees || 'Not specified'}</li>
        <li><strong>Preferred Date:</strong> ${formData.preferredDate || 'Not specified'}</li>
        <li><strong>Requirements:</strong> ${formData.requirements || 'None'}</li>
      </ul>
    ` : isLead ? `
      <h3>Lead Information:</h3>
      <ul>
        <li><strong>Message:</strong> ${formData.message || 'No message provided'}</li>
        <li><strong>Industry:</strong> ${formData.industry || 'Not specified'}</li>
      </ul>
    ` : `
      <h3>Sales Details:</h3>
      <ul>
        <li><strong>Current Challenges:</strong> ${formData.currentChallenges || 'Not specified'}</li>
        <li><strong>Budget:</strong> ${formData.budget || 'Not specified'}</li>
        <li><strong>Timeline:</strong> ${formData.timeline || 'Not specified'}</li>
        <li><strong>Technical Requirements:</strong> ${formData.technicalRequirements || 'None'}</li>
        <li><strong>Support Needs:</strong> ${formData.supportNeeds || 'None'}</li>
      </ul>
    `}
    
    <p><small>Submitted on ${new Date(formData.timestamp).toLocaleString()}</small></p>
  `;
}

// Format auto-reply email
function formatAutoReply(formData) {
  const isDemo = formData.formType === 'demo';
  const isLead = formData.formType === 'lead';
  const inquiryType = isDemo ? 'demo request' : isLead ? 'inquiry' : 'sales inquiry';
  
  return `
    <h2>Thank you for contacting CHIRAL Robotics</h2>
    
    <p>Dear ${formData.contactPerson},</p>
    
    <p>We have received your ${inquiryType} and appreciate your interest in CHIRAL's advanced robotics solutions.</p>
    
    <p>Our team will review your requirements and contact you within 24 hours to discuss how we can help address your operational needs.</p>
    
    ${isDemo ? `
      <p>In preparation for the demo, you may want to:</p>
      <ul>
        <li>Prepare specific questions about your use cases</li>
        <li>Gather information about your operational environment</li>
        <li>Identify key stakeholders who should attend</li>
      </ul>
    ` : isLead ? `
      <p>While you wait, you can:</p>
      <ul>
        <li>Browse our product catalog on our website</li>
        <li>Review our case studies and applications</li>
        <li>Download technical specifications and brochures</li>
      </ul>
    ` : `
      <p>While you wait, you can:</p>
      <ul>
        <li>Browse our product catalog on our website</li>
        <li>Review our case studies and applications</li>
        <li>Download technical specifications</li>
      </ul>
    `}
    
    <p>If you have any urgent questions, please don't hesitate to contact us through our website or email.</p>
    
    <p>Best regards,<br>
    The CHIRAL Team</p>
    
    <hr>
    <p><small>CHIRAL Robotics Solutions Ltd.<br>
    Advanced Industrial Robotics<br>
    www.chiralrobotics.com</small></p>
  `;
}

// Brochure API endpoints

// Get all brochures
app.get('/api/brochures', (req, res) => {
  try {
    const brochures = JSON.parse(fs.readFileSync(brochuresFile, 'utf8') || '[]');
    res.json(brochures);
  } catch (err) {
    console.error('Error retrieving brochures:', err);
    res.status(500).json({ error: 'Failed to retrieve brochures' });
  }
});

// Upload new brochure
app.post('/api/brochures', brochureUpload.single('brochure'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, category } = req.body;
    
    if (!title || !category) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const brochures = JSON.parse(fs.readFileSync(brochuresFile, 'utf8') || '[]');
    
    const newBrochure = {
      id: uuidv4(),
      title,
      description: description || '',
      category,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      downloadUrl: `/uploads/brochures/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    brochures.push(newBrochure);
    fs.writeFileSync(brochuresFile, JSON.stringify(brochures, null, 2));

    res.json({ success: true, brochure: newBrochure });
  } catch (err) {
    console.error('Error uploading brochure:', err);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload brochure' });
  }
});

// Delete brochure
app.delete('/api/brochures/:id', (req, res) => {
  try {
    const { id } = req.params;
    const brochures = JSON.parse(fs.readFileSync(brochuresFile, 'utf8') || '[]');
    
    const brochureIndex = brochures.findIndex(b => b.id === id);
    if (brochureIndex === -1) {
      return res.status(404).json({ error: 'Brochure not found' });
    }

    const brochure = brochures[brochureIndex];
    
    // Delete file from disk
    const filePath = path.join(brochuresDir, brochure.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from brochures array
    brochures.splice(brochureIndex, 1);
    fs.writeFileSync(brochuresFile, JSON.stringify(brochures, null, 2));

    res.json({ success: true, message: 'Brochure deleted successfully' });
  } catch (err) {
    console.error('Error deleting brochure:', err);
    res.status(500).json({ error: 'Failed to delete brochure' });
  }
});

// Get brochures by category
app.get('/api/brochures/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const brochures = JSON.parse(fs.readFileSync(brochuresFile, 'utf8') || '[]');
    
    const categoryBrochures = brochures.filter(b => b.category === category);
    res.json(categoryBrochures);
  } catch (err) {
    console.error('Error retrieving brochures by category:', err);
    res.status(500).json({ error: 'Failed to retrieve brochures' });
  }
});

// Handle 404 for API routes
app.use('/api/*', notFoundHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Admin dashboard connected:', socket.id);
  
  socket.on('authenticate', (token) => {
    const user = Auth.verifyToken(token);
    if (user) {
      socket.join('authenticated');
      socket.user = user;
      console.log(`User ${user.username} authenticated on socket ${socket.id}`);
      
      // Send initial dashboard data
      const stats = Lead.getStatistics();
      const pendingFollowUps = FollowUp.findPending();
      
      socket.emit('dashboard_data', {
        stats,
        pending_follow_ups: pendingFollowUps.length,
        recent_leads: Lead.findAll({ limit: 5 })
      });
    } else {
      socket.emit('auth_error', 'Invalid token');
    }
  });

  socket.on('mark_notification_read', (notificationId) => {
    // Handle notification read status
    console.log(`Notification ${notificationId} marked as read by ${socket.user?.username}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start email queue processing
emailQueue.startCronJobs();

// Start server
server.listen(PORT, () => {
  console.log(`🚀 CHIRAL Email Management System running on http://localhost:${PORT}`);
  console.log(`📧 Resend API Key configured: ${!!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here'}`);
  console.log(`🔐 Default admin login: admin / ChiralAdmin123!`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📋 API Documentation: http://localhost:${PORT}/api`);
});