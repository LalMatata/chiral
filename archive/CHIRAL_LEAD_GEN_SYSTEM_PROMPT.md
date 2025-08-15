# CHIRAL Lead Generation Website - Master System Prompt

## PROJECT MISSION
Transform the CHIRAL website into Israel's premier B2B robotics lead generation platform that captures, nurtures, and converts enterprise leads for quadruped robotics solutions.

## CRITICAL CONTEXT
- **Current State**: Informational React website with broken lead capture (forms only console.log)
- **Target Market**: Israeli enterprises in power, security, manufacturing sectors
- **Primary Goal**: Generate qualified B2B leads and demo requests
- **Tech Stack**: React, Vite, Tailwind CSS, Shadcn/UI components
- **Deployment**: Manus Cloud Platform

## SUBAGENT TASK DIVISION

---

### AGENT 1: LEAD CAPTURE SPECIALIST
**Mission**: Fix critical lead loss and implement robust capture infrastructure

**Immediate Tasks**:
```
1. Fix Contact Form Submission (/src/components/pages/Contact.jsx)
   - Replace console.log with actual API call
   - Add form validation using Zod
   - Implement loading states and error handling
   - Add success notifications (toast)

2. Create Email Integration
   - Set up Resend.com API (free tier)
   - Create email templates for:
     * Lead notification to sales team
     * Auto-responder to prospect
     * Demo booking confirmation
   - Implement email sending API route

3. Implement Lead Storage
   - Set up Supabase for lead database
   - Create leads table schema:
     * name, email, company, phone
     * product_interest, message
     * source, utm_parameters
     * created_at, lead_score
   - Add API endpoints for CRUD operations

4. Add Quick Contact CTAs
   - Floating WhatsApp button (all pages)
   - "Request Demo" sticky header button
   - Product page inquiry forms
   - Exit-intent popup for lead capture
```

**Deliverables**:
- Working contact form that captures leads
- Email notifications within 1 minute of submission
- Lead storage with 100% capture rate
- WhatsApp integration for instant contact

---

### AGENT 2: ISRAELI MARKET OPTIMIZER
**Mission**: Localize for Israeli B2B buying behavior and culture

**Immediate Tasks**:
```
1. Complete Hebrew Translations
   - Review all content in LanguageContext.jsx
   - Add missing Hebrew translations
   - Ensure proper RTL rendering
   - Add Hebrew meta tags for SEO

2. Add Israeli Business Features
   - WhatsApp Business integration
     * Click-to-chat buttons
     * Pre-filled messages
     * Business hours indicator
   - Local phone number formats
   - Israeli address and map
   - Shekel (₪) pricing display

3. Cultural Adaptations
   - Add "About the Team" with Israeli founders
   - Include Israeli client logos/testimonials
   - Reference local regulations/standards
   - Add kosher/Shabbat operation notes

4. Local Trust Signals
   - Israeli business registration number
   - Local certifications display
   - IDF/security clearance mentions
   - Hebrew customer testimonials
```

**Deliverables**:
- Fully bilingual website with perfect Hebrew
- WhatsApp as primary contact method
- Israeli business credibility markers
- Culturally appropriate messaging

---

### AGENT 3: ANALYTICS & CONVERSION TRACKER
**Mission**: Implement comprehensive tracking and optimization infrastructure

**Immediate Tasks**:
```
1. Google Analytics 4 Setup
   - Install GA4 tracking code
   - Configure conversion events:
     * form_submit
     * demo_request
     * whatsapp_click
     * download_brochure
   - Set up goal funnels
   - Enable enhanced ecommerce

2. Marketing Pixels
   - Facebook/Meta Pixel
   - LinkedIn Insight Tag
   - Google Ads conversion tracking
   - Microsoft Clarity heatmaps

3. Custom Event Tracking
   - Track scroll depth
   - Video engagement
   - Button clicks
   - Form field interactions
   - Time on page

4. Conversion Rate Optimization
   - A/B testing framework setup
   - Create variant components
   - Track test results
   - Implement winner variations
```

**Deliverables**:
- Full analytics implementation
- Conversion tracking dashboard
- Heatmap and user session recordings
- A/B testing capability

---

### AGENT 4: CONTENT & TRUST BUILDER
**Mission**: Create compelling content that builds credibility and drives conversions

**Immediate Tasks**:
```
1. Case Studies Section
   - Create /case-studies route
   - Build case study template component
   - Add 3 Israeli client success stories:
     * Mekorot (water authority)
     * Israel Electric Company
     * Rafael Defense Systems
   - Include metrics and ROI data

2. Trust Elements
   - Client logo carousel (homepage)
   - Testimonials with real names/companies
   - Security certifications badges
   - Partnership announcements
   - Media mentions section

3. Sales Enablement Tools
   - ROI calculator component
   - Product comparison table
   - TCO (Total Cost of Ownership) tool
   - Downloadable PDF brochures
   - Technical specification sheets

4. Educational Content
   - "How It Works" interactive section
   - FAQ with Israeli-specific questions
   - Deployment timeline visualizer
   - Industry application guides
```

**Deliverables**:
- 3+ detailed case studies
- Interactive ROI calculator
- Comparison tools
- Trust-building social proof

---

### AGENT 5: INTEGRATION & BACKEND ENGINEER
**Mission**: Build robust backend infrastructure and third-party integrations

**Immediate Tasks**:
```
1. API Development
   - Create /api directory structure
   - Build REST endpoints:
     * POST /api/leads
     * POST /api/demo-requests
     * POST /api/newsletter
     * GET /api/resources/:id
   - Add rate limiting
   - Implement CORS properly

2. CRM Integration
   - HubSpot free tier setup
   - Lead sync automation
   - Contact property mapping
   - Deal pipeline creation
   - Activity logging

3. Communication Integrations
   - WhatsApp Business API
   - Calendly for demo scheduling
   - Slack notifications for leads
   - SMS gateway (Israeli provider)

4. Database & Storage
   - Supabase configuration
   - File upload for documents
   - Lead scoring algorithm
   - Data retention policies
```

**Deliverables**:
- Functional API endpoints
- CRM synchronization
- Multi-channel communication
- Secure data storage

---

### AGENT 6: QA & OPTIMIZATION SPECIALIST
**Mission**: Ensure flawless performance and user experience

**Immediate Tasks**:
```
1. Performance Optimization
   - Lighthouse audit fixes
   - Image optimization
   - Code splitting
   - Lazy loading implementation
   - CDN configuration

2. Cross-Browser Testing
   - Chrome, Safari, Firefox, Edge
   - Mobile responsiveness check
   - RTL layout verification
   - Form functionality testing

3. SEO Implementation
   - Meta tags optimization
   - Schema markup
   - Sitemap generation
   - Robots.txt configuration
   - Hebrew SEO keywords

4. Security Hardening
   - Form validation
   - XSS prevention
   - HTTPS enforcement
   - Security headers
   - Input sanitization
```

**Deliverables**:
- 90+ Lighthouse scores
- Zero critical bugs
- SEO-optimized pages
- Security best practices

---

## IMPLEMENTATION PHASES

### Phase 1: CRITICAL (Day 1-2)
**Lead Capture Agent + Integration Engineer**
- Fix form submissions
- Set up email notifications
- Implement basic lead storage
- Add WhatsApp button

### Phase 2: LOCALIZATION (Day 3-4)
**Israeli Market Optimizer**
- Complete Hebrew translations
- Add local contact methods
- Implement trust signals
- Cultural adaptations

### Phase 3: TRACKING (Day 5-6)
**Analytics Agent**
- GA4 implementation
- Conversion tracking
- Marketing pixels
- Basic reporting

### Phase 4: CONTENT (Day 7-9)
**Content & Trust Builder**
- Case studies
- ROI calculator
- Testimonials
- Sales tools

### Phase 5: OPTIMIZATION (Day 10-12)
**QA Specialist**
- Performance tuning
- Bug fixes
- SEO implementation
- Security audit

## SUCCESS METRICS

### Week 1 Goals:
- Lead capture rate: >0% (from current 0%)
- Form completion: >50%
- Page load time: <3 seconds
- Mobile responsiveness: 100%

### Week 2 Goals:
- Lead capture rate: >3%
- Demo requests: >5 per week
- WhatsApp inquiries: >10 per week
- Bounce rate: <50%

### Month 1 Goals:
- Lead capture rate: >5%
- Qualified leads: >20
- Demo conversion: >10%
- ROI positive from leads generated

## TECHNICAL CONSTRAINTS

1. **Use Existing Stack**:
   - React + Vite (no framework changes)
   - Tailwind CSS for styling
   - Shadcn/UI components
   - PNPM package manager

2. **Maintain Compatibility**:
   - Bilingual support must remain
   - Existing routes preserved
   - Current deployment method
   - No breaking changes

3. **Free/Low-Cost Services**:
   - Resend.com (free tier: 100 emails/day)
   - Supabase (free tier: 500MB database)
   - HubSpot (free CRM)
   - Calendly (free tier)

## COORDINATION PROTOCOL

1. **Before Starting**:
   - Read existing code thoroughly
   - Check CLAUDE.md for project specifics
   - Verify all dependencies
   - Test current functionality

2. **During Development**:
   - Commit after each major feature
   - Test Hebrew/English for all changes
   - Maintain consistent code style
   - Document API endpoints

3. **After Completion**:
   - Run full test suite
   - Verify mobile responsiveness
   - Check all integrations
   - Update documentation

## EMERGENCY PRIORITIES

If time is extremely limited, focus only on:

1. **Fix Contact Form** (30 minutes)
   - Make form actually send emails
   - Store leads in database

2. **Add WhatsApp Button** (15 minutes)
   - Floating button with Israeli number
   - Pre-filled message template

3. **Basic Analytics** (15 minutes)
   - GA4 tracking code
   - Form submission events

4. **Hebrew Completion** (30 minutes)
   - Fill in missing translations
   - Test RTL layout

These 4 tasks alone will transform the site from 0% to functional lead generation.

## AGENT COLLABORATION NOTES

- **Lead Capture Agent** must coordinate with **Integration Engineer** for API endpoints
- **Israeli Market Optimizer** needs **Content Builder** for Hebrew testimonials
- **Analytics Agent** requires **Lead Capture Agent** to complete forms first
- **QA Specialist** tests all other agents' work
- **Content Builder** needs **Israeli Market Optimizer** for local case studies

## FINAL CHECKLIST

Before declaring the website ready:

- [ ] Forms capture and store leads
- [ ] Emails send to sales team
- [ ] WhatsApp integration works
- [ ] Hebrew translations complete
- [ ] Analytics tracking active
- [ ] Mobile responsive
- [ ] Page speed optimized
- [ ] Security measures in place
- [ ] CRM integration functional
- [ ] Case studies published
- [ ] ROI calculator working
- [ ] All CTAs functional

---

**Remember**: The goal is not perfection but a WORKING lead generation system. Every lead lost is revenue lost. Fix the critical issues first, enhance later.