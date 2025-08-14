# 📧 CHIRAL Email Management System

A comprehensive email collection and lead management system built for CHIRAL Robotics to handle inquiries from advertising campaigns and website visitors.

## 🎯 Business Overview

This system is designed to handle the critical business need of capturing and managing sales leads for CHIRAL Robotics. With upcoming advertising campaigns, the system provides:

- **Immediate Lead Capture** - All website inquiries are instantly saved
- **Automated Email Responses** - Professional auto-replies and sales notifications
- **Lead Scoring & Prioritization** - Automatic scoring based on inquiry type, budget, and timeline
- **Real-time Dashboard** - Live notifications and lead management interface
- **Follow-up Management** - Systematic task tracking and scheduling
- **Analytics & Reporting** - Conversion tracking and performance metrics

## 🏗️ System Architecture

### Backend (Node.js + Express)
- **Database**: SQLite with comprehensive lead tracking
- **Email Service**: Resend integration with queue-based delivery
- **Authentication**: JWT-based with role-based permissions
- **Real-time**: Socket.io for live dashboard updates
- **Security**: Rate limiting, input validation, password hashing

### Frontend (React)
- **Admin Dashboard**: Comprehensive lead management interface
- **Real-time Updates**: Live notifications for new leads
- **Data Export**: CSV/Excel export with filtering
- **Responsive Design**: Works on desktop and mobile
- **Multi-language Support**: English/Hebrew support maintained

### Key Features
- **Lead Scoring Algorithm**: Automatic prioritization (0-100 score)
- **Email Queue System**: Reliable delivery with retry mechanism
- **Follow-up Automation**: Task creation and scheduling
- **Bulk Operations**: Mass status updates and assignments
- **Advanced Analytics**: Conversion tracking and source attribution

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Resend account (for email delivery)
- Domain with email forwarding (Namecheap recommended)

### Installation

1. **Clone and Install**:
```bash
cd email_handler
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the System**:
```bash
# Start backend server
npm run server

# Access the Dashboard:
# Backend API: http://localhost:3001
# Default Login: admin / ChiralAdmin123!
```

## 📋 Configuration

### Required Environment Variables

```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@chiral-robotics.com
SALES_EMAIL=sales@chiral-robotics.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=production
```

### Email Service Setup

1. **Resend Account**:
   - Sign up at [resend.com](https://resend.com)
   - Verify your domain (chiral-robotics.com)
   - Create API key with send permissions

2. **Domain Configuration**:
   - See [Namecheap Email Setup Guide](./docs/NAMECHEAP_EMAIL_SETUP.md)
   - Configure SPF, DKIM, and DMARC records
   - Set up email forwarding for business addresses

## 📊 Lead Management Features

### Lead Scoring System
Leads are automatically scored 0-100 based on:
- **Inquiry Type**: Demo (30pts), Sales (20pts), General (10pts)
- **Budget Indicated**: High budget (+20pts), Medium (+15pts), Low (+10pts)  
- **Timeline**: Immediate/Month (+15pts), Quarter (+10pts), Year (+5pts)
- **Contact Info**: Phone provided (+5pts)
- **Industry**: High-value industries (+10pts)
- **Company Size**: Corporate entities (+5pts)

### Status Workflow
- **New** → **Contacted** → **Qualified** → **Proposal** → **Negotiation** → **Won/Lost**
- **Nurturing** - for long-term prospects

### Automated Actions
- **Auto-reply emails** sent to prospects
- **Sales notifications** sent to team
- **Follow-up tasks** created automatically
- **Lead scoring** calculated on submission
- **Real-time dashboard updates**

## 🔧 API Reference

### Contact Form Submission
```javascript
POST /api/contact
Content-Type: application/json

{
  "companyName": "Example Corp",
  "contactPerson": "John Doe", 
  "email": "john@example.com",
  "phone": "+1234567890",
  "formType": "demo", // "demo", "sales", "lead"
  "industry": "Manufacturing",
  "budget": "50k-100k",
  "timeline": "3 months",
  "message": "Interested in robotic solutions"
}
```

### Lead Management
```javascript
// Get all leads (authenticated)
GET /api/leads
Authorization: Bearer <jwt_token>

// Update lead status
PUT /api/leads/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "contacted",
  "assignedTo": "sales_rep",
  "notes": "Initial contact made"
}

// Add follow-up
POST /api/leads/:id/follow-up
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "action": "Call to discuss requirements",
  "notes": "Follow up on demo request",
  "scheduledFor": "2024-02-01T10:00:00Z"
}
```

## 📈 Analytics & Reporting

### Key Metrics Tracked
- **Total Leads**: All inquiries received
- **Conversion Rate**: Demo requests / total leads
- **Pipeline Value**: Estimated value based on lead types
- **Source Attribution**: Direct, referral, campaign tracking
- **Lead Velocity**: Time from inquiry to conversion
- **Response Time**: Time to first contact

### Dashboard Features
- **Real-time metrics** with live updates
- **Lead source analysis** with pie charts
- **Conversion funnel** tracking
- **Industry breakdown** and trends
- **Performance over time** graphs
- **Team productivity** metrics

## 🛡️ Security Features

### Authentication & Authorization
- **JWT-based authentication** with expiration
- **Role-based access control** (Admin, Manager, Sales)
- **Password hashing** using bcrypt with salt
- **Session management** with secure tokens

### Data Protection
- **Input validation** and sanitization
- **SQL injection prevention** with parameterized queries
- **Rate limiting** on contact forms (5 per 15 minutes)
- **CORS configuration** for secure API access
- **Environment variable** protection for secrets

## 🔄 Email System

### Email Queue & Reliability
- **Asynchronous processing** with queue system
- **Retry mechanism** with exponential backoff
- **Delivery tracking** and status monitoring
- **Bounce handling** and error logging
- **Rate limiting** to prevent spam

### Email Templates
- **Welcome emails** for prospects
- **Sales notifications** for team
- **Demo confirmations** with meeting details
- **Follow-up reminders** for sales team
- **Template management** through admin interface

## 📱 Admin Dashboard

### Lead Management Interface
- **Sortable lead list** with filtering and search
- **Lead details modal** with full information
- **Status updates** with notes and assignment
- **Bulk operations** for multiple leads
- **Follow-up management** with scheduling

### Real-time Features
- **Live notifications** for new leads
- **Socket.io integration** for instant updates
- **Dashboard metrics** updating in real-time
- **Activity feed** showing recent actions
- **Alert system** for high-priority leads

## 🧪 Testing

### Comprehensive Testing Suite
```bash
# Start the server
npm run server

# Test API endpoints
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@testcompany.com",
    "formType": "demo"
  }'
```

See [System Testing Guide](./docs/SYSTEM_TESTING_GUIDE.md) for detailed testing procedures.

## 📚 Documentation

### Complete Documentation Suite
- **[Namecheap Email Setup](./docs/NAMECHEAP_EMAIL_SETUP.md)** - Complete email configuration
- **[System Testing Guide](./docs/SYSTEM_TESTING_GUIDE.md)** - Comprehensive testing procedures

## 🚀 Deployment

### Production Setup
1. **Configure Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3001
   RESEND_API_KEY=your_live_api_key
   JWT_SECRET=secure_production_secret
   SALES_EMAIL=sales@chiral-robotics.com
   ```

2. **Start the System**:
   ```bash
   npm run server
   ```

3. **Verify Setup**:
   - Test API health: `curl http://localhost:3001/health`
   - Submit test contact form
   - Check admin dashboard functionality
   - Verify email delivery

## 📈 Business Impact

### Key Performance Indicators
- **Lead Capture Rate**: 100% of website inquiries saved
- **Response Time**: < 2 hours for initial contact
- **Conversion Rate**: Track demo requests to sales
- **Email Deliverability**: > 95% delivery rate
- **System Uptime**: 99.9% availability target

### ROI Benefits
- **Never Miss a Lead**: Every inquiry captured and scored
- **Professional Communication**: Automated professional responses
- **Efficient Follow-up**: Systematic task management
- **Data-Driven Decisions**: Analytics and reporting
- **Scalable Growth**: Handle increased advertising volume

## 🎯 Quick Implementation Checklist

### Setup Tasks
- [ ] Install Node.js dependencies (`npm install`)
- [ ] Configure environment variables (`.env` file)
- [ ] Set up Resend account and get API key
- [ ] Configure domain email forwarding (Namecheap)
- [ ] Start the server (`npm run server`)

### Email Configuration  
- [ ] Add domain to Resend and verify
- [ ] Configure DNS records (SPF, DKIM, DMARC)
- [ ] Set up email forwarding (sales@, support@, etc.)
- [ ] Test email delivery with mail-tester.com
- [ ] Verify auto-reply and notification emails work

### Dashboard Setup
- [ ] Access admin dashboard (default: admin/ChiralAdmin123!)
- [ ] Test lead list and filtering functionality
- [ ] Verify real-time updates work
- [ ] Test data export (CSV/Excel)
- [ ] Configure user roles and permissions

### Testing & Verification
- [ ] Submit test contact forms
- [ ] Verify leads are saved in database
- [ ] Check email notifications are sent
- [ ] Test admin dashboard functionality  
- [ ] Confirm real-time updates work
- [ ] Verify export functionality

## 🏆 Success Metrics

After setup, you should achieve:

1. **100% Lead Capture** - No inquiries lost
2. **< 30 Second Response** - Automated emails sent immediately  
3. **Professional Image** - Consistent, branded communications
4. **Organized Follow-up** - Systematic task management
5. **Data Visibility** - Clear analytics and reporting
6. **Scalable System** - Ready for advertising campaign volume

## 🤝 Support

### Getting Help
- **Documentation**: Check comprehensive guides in `/docs`
- **Testing**: Use System Testing Guide for troubleshooting
- **Configuration**: Follow Namecheap Email Setup Guide
- **Issues**: Common problems solved in testing documentation

---

**🚀 Ready to capture every lead and maximize your advertising ROI? Deploy the CHIRAL Email Management System today!**