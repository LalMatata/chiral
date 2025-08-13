# CHIRAL Marketing & Analytics Setup Guide

This guide helps you configure the marketing tracking and lead generation features that have been implemented in the MVP.

## 🚀 Immediate Setup Required

### 1. Google Analytics 4
**Status:** ✅ Code implemented, needs tracking ID

**Setup:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new GA4 property for "CHIRAL Robotics"
3. Copy your tracking ID (format: G-XXXXXXXXXX)
4. Replace `G-4YMHPQXJ2R` in `/index.html` with your actual ID

**What's Tracked:**
- Page views
- Lead generation events (valued in ILS)
- WhatsApp clicks
- Quote requests
- UTM campaign tracking

### 2. WhatsApp Business Number
**Status:** ✅ Component ready, needs phone number

**Setup:**
1. Get WhatsApp Business account for CHIRAL
2. Replace `972123456789` in `/src/components/WhatsAppButton.jsx` with your actual number
3. Test the floating WhatsApp button on all pages

### 3. Facebook Pixel (Optional but Recommended)
**Status:** ✅ Code ready, needs Pixel ID

**Setup:**
1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Create new Facebook Pixel
3. Replace `YOUR_PIXEL_ID` in `/index.html` with your actual ID
4. Set up Custom Conversions for lead events

### 4. LinkedIn Insight Tag (Optional for B2B)
**Status:** ✅ Code ready, needs Partner ID

**Setup:**
1. Go to [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager/)
2. Create LinkedIn Insight Tag
3. Replace `YOUR_PARTNER_ID` and `YOUR_CONVERSION_ID` in `/index.html`

## 🎯 Lead Capture Features Implemented

### Quick Quote System
- **Product pages** now have "Get Quick Quote" buttons
- Automatically tracks product interest
- Pre-fills contact forms with product context
- Values leads at ₪2,500 for analytics

### Exit-Intent Popup
- Shows after 10 seconds when user tries to leave
- Captures email for newsletter
- Only shows once per session
- Tracks newsletter signups

### Enhanced Contact Forms
- URL parameters pre-fill forms (`/contact?product=x30&type=quote`)
- Multiple form types: contact, quote, demo
- Enhanced tracking for all conversions
- Better user experience with dynamic content

## 📊 What You'll Get

### Immediate Insights
- **Real visitors** tracked in real-time
- **Lead values** in Israeli Shekels
- **Conversion tracking** across all touchpoints
- **Campaign attribution** from UTM parameters

### Business Intelligence
- Which products generate most interest
- WhatsApp vs. form preference
- Exit-intent popup effectiveness
- Complete lead generation funnel

## 🔧 Testing Your Setup

### 1. Analytics Test
1. Visit your website
2. Check Google Analytics Real-Time reports
3. Fill out contact form
4. Verify "generate_lead" event appears

### 2. WhatsApp Test
1. Click WhatsApp button on any page
2. Verify it opens WhatsApp with pre-filled message
3. Check analytics for "whatsapp_click" event

### 3. Lead Tracking Test
1. Use this URL: `/contact?product=x30&type=quote`
2. Fill out the form
3. Check that product is pre-selected and form type changes

## 💰 Expected ROI

### Week 1 Targets:
- 10+ qualified leads
- 3+ WhatsApp conversations  
- 5+ newsletter signups

### Month 1 Targets:
- 50+ qualified leads
- 5+ demos scheduled
- 1+ closed sale

## 🚨 Critical Next Steps

1. **Replace placeholder IDs** in `/index.html` with real tracking codes
2. **Update WhatsApp number** in `/src/components/WhatsAppButton.jsx`
3. **Test all tracking** before launching campaigns
4. **Set up conversion goals** in Google Analytics

## 🚀 Deployment Setup

### Your Own Server Deployment
**Status:** Ready for your IP address

**Deployment Files:**
- `dist/` folder contains production-ready build
- `server.js` runs the Express backend for lead capture
- Both frontend and backend ready for your server

**Server Requirements:**
- Node.js 18+ 
- SSL certificate for HTTPS (required for tracking pixels)
- Domain name pointing to your IP
- Port 80/443 for web traffic
- Port 3001 for backend API (or configure proxy)

**Deployment Commands:**
```bash
npm run build                    # Build production files
node server.js                  # Start backend API
# Serve dist/ folder with nginx/apache
```

## 📞 Quick Reference

### Tracking Functions Available
- `window.trackLead(type, product)` - Track lead generation
- `window.trackWhatsApp(page)` - Track WhatsApp clicks  
- `window.trackQuoteRequest(product)` - Track quote requests
- `window.fbTrackLead(value)` - Facebook lead tracking
- `window.linkedinTrackLead()` - LinkedIn conversion tracking

### URL Parameters for Pre-filling
- `?product=x30` - Pre-select X30 series
- `?type=quote` - Set form to quote mode
- `?type=demo` - Set form to demo mode
- `?utm_source=google&utm_campaign=robotics` - Track campaign source

### Environment Variables Needed
```bash
RESEND_API_KEY=your_resend_api_key_here
SALES_EMAIL=sales@chiral-robotics.com
PORT=3001
```

---

**Remember:** This setup transforms your website from a brochure into a lead generation machine. Every visitor interaction is now tracked and optimized for conversion.

**Priority:** Set up Google Analytics immediately - this is your most important business intelligence tool.

**Deployment:** Ready to deploy to your own server - just provide the IP when ready!