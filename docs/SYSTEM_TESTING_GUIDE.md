# CHIRAL Email Management System - Testing Guide

This guide provides comprehensive testing procedures to verify the email management system is working correctly before deploying to production.

## 🧪 Testing Overview

### Test Categories

1. **Backend API Testing** - Database operations and API endpoints
2. **Email System Testing** - Email sending, queues, and templates
3. **Frontend Dashboard Testing** - Admin interface functionality
4. **Integration Testing** - End-to-end workflows
5. **Performance Testing** - Load handling and response times
6. **Security Testing** - Authentication and authorization

## 🚀 Quick Start Testing

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret
SALES_EMAIL=sales@chiral-robotics.com
```

3. Initialize database:
```bash
# Database will be created automatically when server starts
npm run server
```

## 📋 Backend API Testing

### 1. Database Initialization Test

**Purpose**: Verify database tables are created correctly

```bash
# Start server and check logs
npm run server

# Expected log output:
# ✓ Database initialized
# ✓ Default admin user created
# ✓ Server running on http://localhost:3001
```

**Manual Verification**:
- Check that `data/chiral.db` file exists
- Verify database tables were created
- Confirm default admin user exists

### 2. Authentication Tests

**Test Login Endpoint**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "ChiralAdmin123!"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@chiral-robotics.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

**Test Protected Endpoint**:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/auth/me
```

### 3. Lead Management Tests

**Create Test Lead**:
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@testcompany.com",
    "phone": "+1234567890",
    "formType": "demo",
    "industry": "Manufacturing",
    "message": "Interested in robotic solutions"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

**Retrieve Leads**:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/leads
```

**Update Lead Status**:
```bash
curl -X PUT http://localhost:3001/api/leads/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted",
    "notes": "Initial contact made"
  }'
```

### 4. Follow-up System Tests

**Create Follow-up**:
```bash
curl -X POST http://localhost:3001/api/leads/1/follow-up \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "Call to discuss requirements",
    "notes": "Follow up on demo request",
    "scheduledFor": "2024-02-01T10:00:00Z"
  }'
```

**Get Follow-ups**:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/leads/1/follow-ups
```

## 📧 Email System Testing

### 1. Email Queue Test

**Verify Email Queue Processing**:
1. Submit a contact form (creates queued emails)
2. Check server logs for email processing:
```
Email sent successfully: 1 to sales@chiral-robotics.com
Email sent successfully: 2 to john@testcompany.com
```

**Manual Queue Inspection**:
```bash
# Check email queue table (requires SQLite browser or query)
# Look for entries in email_queue table
```

### 2. Email Template Test

**Test Welcome Email Template**:
```javascript
// Access http://localhost:3001/admin and go to Templates tab
// Preview the "Welcome Email" template
// Verify variables are properly replaced
```

**Test Lead Notification Template**:
```javascript
// Submit a test lead through contact form
// Verify notification email is sent to sales team
// Check email content matches template
```

### 3. Email Deliverability Test

**If Resend is configured**:
1. Submit test contact form
2. Check Resend dashboard for delivery status
3. Verify emails are delivered (not bounced)
4. Check spam scores using mail-tester.com

## 🖥️ Frontend Dashboard Testing

### 1. Admin Dashboard Access

**Test Dashboard Login**:
1. Navigate to `http://localhost:3000/admin` (if frontend is running)
2. Login with admin credentials
3. Verify dashboard loads with metrics

**Test Without Authentication**:
1. Clear browser storage
2. Try to access admin features
3. Verify graceful fallback to basic functionality

### 2. Lead Management Interface

**Test Lead List**:
- [ ] Leads display correctly
- [ ] Filtering by status works
- [ ] Search functionality works
- [ ] Sorting columns work
- [ ] Pagination works (if >20 leads)

**Test Lead Details Modal**:
- [ ] Lead details display correctly
- [ ] Status updates work
- [ ] Follow-up creation works
- [ ] Notes are saved

**Test Bulk Operations**:
- [ ] Select multiple leads
- [ ] Bulk status update works
- [ ] Bulk assignment works

### 3. Real-time Updates

**Test Socket.IO Integration**:
1. Open admin dashboard in browser
2. Submit contact form in another tab/browser
3. Verify notification appears in dashboard
4. Check lead count updates in real-time

### 4. Data Export

**Test CSV Export**:
- [ ] Export button works
- [ ] CSV file downloads
- [ ] File contains correct data
- [ ] Filtering applies to export

**Test Excel Export**:
- [ ] Excel export works
- [ ] File opens in Excel/LibreOffice
- [ ] Formatting is preserved
- [ ] All columns are included

## 🔄 Integration Testing

### 1. Complete Lead Workflow

**End-to-End Test**:
1. **Submit Form**: Fill out website contact form
2. **Database Storage**: Verify lead saved in database
3. **Email Queue**: Verify emails queued for sending
4. **Email Delivery**: Verify emails sent successfully
5. **Real-time Update**: Verify dashboard updated
6. **Follow-up Creation**: Verify automatic follow-up created
7. **Status Management**: Update lead status
8. **Export Data**: Export lead data

**Expected Timeline**:
- Form submission: < 2 seconds
- Email queuing: Immediate
- Email sending: < 30 seconds
- Dashboard update: < 5 seconds

### 2. Error Handling Tests

**Test Invalid Form Data**:
```bash
# Missing required fields
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company"
  }'

# Expected: 400 error with validation message
```

**Test Rate Limiting**:
```bash
# Submit 6 forms rapidly from same IP
# Expected: 429 error on 6th submission
```

**Test Database Errors**:
```bash
# Stop database or corrupt file
# Submit form
# Expected: Graceful error handling
```

## ⚡ Performance Testing

### 1. Load Testing

**Contact Form Load Test**:
```bash
# Install artillery for load testing
npm install -g artillery

# Create test script
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Contact Form Submission"
    requests:
      - post:
          url: "/api/contact"
          json:
            companyName: "Load Test Company"
            contactPerson: "Test User"
            email: "test@example.com"
            formType: "lead"
EOF

# Run load test
artillery run load-test.yml
```

**Expected Results**:
- Response time: < 500ms (95th percentile)
- Success rate: > 99%
- No memory leaks
- Database handles concurrent writes

### 2. Database Performance

**Large Dataset Test**:
1. Create 1000+ test leads
2. Test lead listing performance
3. Test search and filtering performance
4. Test export performance

**Expected Performance**:
- Lead list loading: < 1 second
- Search results: < 500ms
- Export 1000 leads: < 5 seconds

## 🛡️ Security Testing

### 1. Authentication Security

**Test JWT Security**:
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected
- [ ] Token required for protected endpoints
- [ ] Role-based access control works

**Test Password Security**:
- [ ] Passwords are hashed (bcrypt)
- [ ] Weak passwords rejected
- [ ] Password changes work correctly

### 2. Input Validation

**Test SQL Injection**:
```bash
# Try SQL injection in search
curl "http://localhost:3001/api/leads?search='; DROP TABLE leads; --"

# Expected: No database damage, proper escaping
```

**Test XSS Prevention**:
```bash
# Submit form with XSS payload
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "<script>alert(\"xss\")</script>",
    "contactPerson": "Test",
    "email": "test@example.com",
    "formType": "lead"
  }'

# Expected: Script tags escaped/sanitized
```

### 3. Rate Limiting

**Test Contact Form Rate Limiting**:
```bash
# Script to test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/contact \
    -H "Content-Type: application/json" \
    -d "{\"companyName\": \"Test $i\", \"contactPerson\": \"Test\", \"email\": \"test$i@example.com\", \"formType\": \"lead\"}"
  echo "Request $i completed"
done
```

## 📊 Monitoring and Logging

### 1. System Health Checks

**Health Endpoint Test**:
```bash
curl http://localhost:3001/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

**Status Endpoint Test**:
```bash
curl http://localhost:3001/status

# Expected response:
{
  "status": "healthy",
  "leads": 5,
  "subscribers": 2,
  "emailConfigured": true
}
```

### 2. Error Logging

**Check Log Files**:
- [ ] Errors are logged with timestamps
- [ ] Log levels are appropriate
- [ ] No sensitive data in logs
- [ ] Email sending logs are detailed

## 🔧 Production Readiness Checklist

### Environment Configuration
- [ ] Production environment variables set
- [ ] Database properly configured
- [ ] Email service (Resend) configured
- [ ] HTTPS configured
- [ ] CORS settings appropriate

### Security
- [ ] Strong JWT secret configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] Authentication required for admin functions
- [ ] Passwords properly hashed

### Performance
- [ ] Database indexes created
- [ ] Email queue processing efficiently
- [ ] Memory usage stable
- [ ] Response times acceptable
- [ ] Error handling graceful

### Monitoring
- [ ] Health checks working
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Email delivery monitoring
- [ ] Database backup strategy

### Backup and Recovery
- [ ] Database backup procedure tested
- [ ] Configuration backup available
- [ ] Recovery procedures documented
- [ ] Data export/import tested

## 🚨 Troubleshooting Common Issues

### Database Issues

**Database file not found**:
```bash
# Ensure data directory exists
mkdir -p data

# Restart server to recreate database
npm run server
```

**SQLite locked error**:
```bash
# Stop all server processes
pkill -f "node server.js"

# Restart server
npm run server
```

### Email Issues

**Emails not being sent**:
1. Check RESEND_API_KEY is correctly set
2. Verify Resend account is active
3. Check server logs for email errors
4. Test with mail-tester.com

**High bounce rates**:
1. Verify DNS configuration
2. Check SPF/DKIM records
3. Review email content for spam triggers
4. Warm up domain reputation

### Frontend Issues

**Dashboard not loading**:
1. Check if both frontend and backend are running
2. Verify CORS configuration
3. Check browser console for errors
4. Verify API endpoints are accessible

**Real-time updates not working**:
1. Check Socket.IO connection in browser dev tools
2. Verify WebSocket is not blocked by firewall
3. Check server logs for socket errors

## ✅ Testing Sign-off Checklist

Before deploying to production, ensure all tests pass:

### Backend Tests
- [ ] Database initialization works
- [ ] All API endpoints respond correctly
- [ ] Authentication and authorization work
- [ ] Lead CRUD operations work
- [ ] Follow-up system works
- [ ] Email queue processes correctly
- [ ] Error handling is graceful

### Frontend Tests
- [ ] Dashboard loads correctly
- [ ] Lead management interface works
- [ ] Real-time updates function
- [ ] Export functionality works
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility

### Integration Tests
- [ ] End-to-end lead workflow works
- [ ] Email delivery is reliable
- [ ] Performance meets requirements
- [ ] Security measures are effective

### Production Readiness
- [ ] Environment configured for production
- [ ] Monitoring and logging setup
- [ ] Backup procedures in place
- [ ] Documentation is complete

## 🎯 Success Criteria

The system is ready for production when:

1. **Reliability**: 99%+ uptime and success rate for lead processing
2. **Performance**: < 2 second response times for form submissions
3. **Scalability**: Handles 1000+ leads without performance degradation
4. **Security**: Passes all security tests without vulnerabilities
5. **Usability**: Dashboard is intuitive and responsive
6. **Email Delivery**: > 95% email delivery rate with < 2% bounce rate

## 📞 Support and Escalation

If critical issues are found during testing:

1. **Document the Issue**: Detailed reproduction steps
2. **Check Logs**: Server and email service logs
3. **Review Configuration**: Verify all settings are correct
4. **Test in Isolation**: Reproduce issue in minimal environment
5. **Escalate if Needed**: Contact development team with findings

This comprehensive testing ensures your CHIRAL Robotics email management system is robust, secure, and ready to handle your advertising campaign leads effectively.