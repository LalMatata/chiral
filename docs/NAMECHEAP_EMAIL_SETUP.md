# Namecheap Email Configuration Guide for CHIRAL Robotics

This guide will help you configure professional email forwarding and SMTP settings for your CHIRAL Robotics domain using Namecheap.

## 📋 Prerequisites

- Domain registered with Namecheap (chiralrobotics.com)
- Access to Namecheap account dashboard
- Resend account for SMTP (recommended) or Namecheap email hosting

## 🎯 Email Setup Goals

1. **Professional Email Addresses**: Set up emails like sales@chiralrobotics.com, support@chiralrobotics.com
2. **Email Forwarding**: Forward business emails to your main inbox
3. **SMTP Configuration**: Enable the website to send automated emails
4. **Email Deliverability**: Ensure high delivery rates and avoid spam folders

## 🚀 Step-by-Step Configuration

### Step 1: Enable Email Forwarding in Namecheap

1. **Log into Namecheap**
   - Go to [namecheap.com](https://namecheap.com) and log in
   - Navigate to "Domain List" and click "Manage" next to your domain

2. **Access Email Settings**
   - Click on the "Advanced DNS" tab
   - Look for "Mail Settings" or "Email Forwarding" section

3. **Set Up Email Forwarding**
   ```
   Create these forwarding rules:
   sales@chiralrobotics.com → your-main-email@gmail.com
   support@chiralrobotics.com → your-main-email@gmail.com
   admin@chiralrobotics.com → your-main-email@gmail.com
   noreply@chiralrobotics.com → your-main-email@gmail.com
   ```

4. **Configure MX Records**
   - Ensure MX records point to Namecheap's mail servers:
   ```
   Priority 10: mx1.privateemail.com
   Priority 10: mx2.privateemail.com
   ```

### Step 2: DNS Configuration for Email Authentication

Add these DNS records in Namecheap Advanced DNS:

1. **SPF Record** (TXT Record)
   ```
   Host: @
   Value: v=spf1 include:_spf.mx.cloudflare.net include:spf.efwd.registrar-servers.com ~all
   TTL: Automatic
   ```

2. **DKIM Record** (will be provided by your email service)
   ```
   Host: [provided-by-service]._domainkey
   Value: [provided-by-service]
   TTL: Automatic
   ```

3. **DMARC Policy** (TXT Record)
   ```
   Host: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:admin@chiralrobotics.com
   TTL: Automatic
   ```

### Step 3: Configure Resend for SMTP (Recommended)

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com) and sign up
   - Verify your account

2. **Add Your Domain**
   - In Resend dashboard, go to "Domains"
   - Click "Add Domain" and enter `chiralrobotics.com`
   - Follow verification steps

3. **Get DNS Records from Resend**
   - Resend will provide specific DNS records
   - Add these to your Namecheap Advanced DNS:
   ```
   TXT Record for domain verification
   CNAME records for DKIM authentication
   ```

4. **Create API Key**
   - Go to "API Keys" in Resend dashboard
   - Create a new key with "Send" permissions
   - Copy the API key for server configuration

### Step 4: Server Environment Configuration

Update your `.env` file with email configuration:

```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@chiralrobotics.com
SALES_EMAIL=sales@chiralrobotics.com
SUPPORT_EMAIL=support@chiralrobotics.com

# SMTP Settings (if using direct SMTP instead of Resend)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=noreply@chiralrobotics.com
SMTP_PASS=your_email_password
SMTP_SECURE=true
```

### Step 5: Test Email Configuration

1. **Test Email Forwarding**
   - Send test emails to sales@chiralrobotics.com
   - Verify they arrive in your main inbox

2. **Test Website Email Sending**
   - Submit a test form on your website
   - Check if you receive the notification email
   - Verify the auto-reply is sent to the form submitter

3. **Test Email Deliverability**
   - Use tools like [mail-tester.com](https://mail-tester.com)
   - Send a test email and check the spam score
   - Aim for a score of 8+/10

## 🛡️ Security Best Practices

### Email Security Settings

1. **Enable Two-Factor Authentication**
   - Enable 2FA on your Namecheap account
   - Enable 2FA on your email forwarding destination

2. **Use Strong Passwords**
   - Use unique, strong passwords for email accounts
   - Consider using a password manager

3. **Monitor Email Activity**
   - Set up alerts for suspicious login attempts
   - Regularly review email logs

### SPAM Prevention

1. **Implement Rate Limiting**
   - The system includes rate limiting for contact forms
   - Maximum 5 submissions per 15 minutes per IP

2. **Use Email Validation**
   - Server validates email format before processing
   - Consider implementing email verification for important forms

3. **Monitor Bounce Rates**
   - Keep bounce rates below 2%
   - Remove invalid emails from your lists

## 📈 Email Performance Optimization

### Delivery Rate Optimization

1. **Warm Up Your Domain**
   - Start with low email volumes
   - Gradually increase sending volume over 2-4 weeks
   - Monitor delivery rates and adjust accordingly

2. **Monitor Email Metrics**
   - Track delivery rates, open rates, bounce rates
   - Use Resend analytics dashboard
   - Set up monitoring alerts for unusual patterns

3. **Maintain Good Sender Reputation**
   - Keep bounce rates below 2%
   - Maintain low complaint rates
   - Send relevant, engaging content

### Template Optimization

1. **Email Template Best Practices**
   - Use responsive design for mobile devices
   - Keep subject lines under 50 characters
   - Include clear call-to-action buttons
   - Use proper HTML structure

2. **Content Guidelines**
   - Avoid spam trigger words
   - Balance text and images
   - Include unsubscribe links where required
   - Use professional branding

## 🔧 Troubleshooting Common Issues

### Email Not Being Received

1. **Check Spam Folders**
   - Verify emails aren't going to spam
   - Ask recipients to whitelist your domain

2. **Verify DNS Records**
   - Use DNS lookup tools to verify records are propagated
   - Check SPF, DKIM, and DMARC configurations

3. **Test Email Authentication**
   - Use tools like [mxtoolbox.com](https://mxtoolbox.com) to test
   - Verify all authentication records are correct

### High Bounce Rates

1. **Email Validation Issues**
   - Check email validation logic in forms
   - Verify email addresses before sending

2. **DNS Configuration Problems**
   - Ensure MX records are correctly configured
   - Verify domain authentication records

3. **Content Issues**
   - Review email content for spam triggers
   - Ensure proper HTML formatting

### Low Delivery Rates

1. **Sender Reputation Issues**
   - Check your domain reputation using reputation monitoring tools
   - Implement gradual volume increases

2. **Authentication Problems**
   - Verify SPF, DKIM, and DMARC records
   - Ensure all records are properly formatted

## 📊 Monitoring and Analytics

### Key Metrics to Track

1. **Delivery Metrics**
   - Delivery rate (should be >95%)
   - Bounce rate (should be <2%)
   - Complaint rate (should be <0.1%)

2. **Engagement Metrics**
   - Open rates for notification emails
   - Click-through rates for marketing emails
   - Response rates for sales outreach

3. **System Performance**
   - Email queue processing time
   - API response times
   - Error rates

### Monitoring Setup

1. **Resend Analytics**
   - Monitor delivery rates and bounces
   - Track email opens and clicks
   - Set up webhook notifications for events

2. **Server Monitoring**
   - Log email sending attempts and results
   - Monitor email queue length and processing time
   - Set up alerts for high error rates

## 📞 Support and Maintenance

### Regular Maintenance Tasks

1. **Monthly Reviews**
   - Review email delivery metrics
   - Clean up bounced email addresses
   - Update email templates as needed

2. **Quarterly Audits**
   - Review and update DNS records
   - Test email deliverability across providers
   - Update security settings and passwords

3. **Annual Reviews**
   - Evaluate email service provider performance
   - Review and update email marketing strategies
   - Update authentication and security measures

### Getting Help

1. **Namecheap Support**
   - Email: support@namecheap.com
   - Live chat available 24/7
   - Knowledge base: [namecheap.com/support](https://namecheap.com/support)

2. **Resend Support**
   - Email: support@resend.com
   - Documentation: [resend.com/docs](https://resend.com/docs)
   - Status page: [status.resend.com](https://status.resend.com)

3. **DNS and Email Testing Tools**
   - [mxtoolbox.com](https://mxtoolbox.com) - MX record and email testing
   - [mail-tester.com](https://mail-tester.com) - Email deliverability testing
   - [dmarcian.com](https://dmarcian.com) - DMARC policy testing

## ✅ Quick Setup Checklist

- [ ] Domain registered with Namecheap
- [ ] Email forwarding configured in Namecheap
- [ ] MX records pointing to mail servers
- [ ] SPF record added to DNS
- [ ] DKIM records configured
- [ ] DMARC policy implemented
- [ ] Resend account created and verified
- [ ] Domain verified in Resend
- [ ] API key created and added to server
- [ ] Environment variables configured
- [ ] Email templates created
- [ ] Test emails sent and verified
- [ ] Spam score tested (8+/10)
- [ ] Monitoring and alerts configured

## 🎯 Expected Results

After completing this setup:

1. **Professional Email Addresses**: You'll have working professional email addresses for your business
2. **Automated Notifications**: The website will automatically send notifications for new leads
3. **High Deliverability**: Emails will reliably reach recipients' inboxes
4. **Scalable System**: The setup can handle increased email volume as your business grows
5. **Monitoring**: You'll have visibility into email performance and delivery metrics

This configuration will ensure your CHIRAL Robotics website has a robust, professional email system ready to handle leads from your advertising campaigns.