# CHIRAL MVP - Minimal Lead Capture System Prompt

## MISSION
Build the absolute minimum viable website to capture leads via email for CHIRAL robotics products. Focus only on making forms work and sending lead notifications.

## CONSTRAINTS
- **NO bilingual support** - English only for MVP
- **Email only** - No WhatsApp, phone, or other channels
- **Minimal changes** - Use existing design/components
- **Free services only** - No paid integrations
- **1-2 days maximum** implementation time

## SUBAGENT DIVISION FOR MVP

---

### AGENT 1: FORM FIX SPECIALIST
**Single Focus**: Make the contact form actually work

**Tasks** (2-3 hours):
```
1. Fix Contact Form (/src/components/pages/Contact.jsx)
   - Replace console.log with fetch() to API endpoint
   - Add basic validation (email format check)
   - Show loading spinner during submission
   - Display success/error message

2. Add "Get Quote" Form to Products Page
   - Simple form: Name, Email, Company, Product Interest
   - Reuse Contact form component logic
   - Place prominently on product pages

3. Add Newsletter Signup (Footer)
   - Just email field
   - Same backend as contact form
   - Mark as "newsletter" type
```

**Code Changes**:
```javascript
// Current (BROKEN):
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form data:', formData); // LOSES 100% OF LEADS!
};

// Fixed (WORKING):
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      setSuccess(true);
      setFormData({});
    }
  } catch (error) {
    setError(true);
  }
  setLoading(false);
};
```

---

### AGENT 2: EMAIL BACKEND DEVELOPER
**Single Focus**: Send email notifications when forms are submitted

**Tasks** (2-3 hours):
```
1. Set up Resend.com
   - Create free account (100 emails/day free)
   - Get API key
   - Install: pnpm add resend

2. Create API Route (/api/contact)
   - Receive form POST data
   - Send email to sales@chiralrobotics.com
   - Send confirmation to user
   - Return success/error response

3. Email Templates (Plain Text)
   - New lead notification (to sales team)
   - Thank you email (to prospect)
   - Keep it simple - no HTML needed
```

**Implementation**:
```javascript
// /api/contact.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { name, email, company, message } = await request.json();
  
  // Email to sales team
  await resend.emails.send({
    from: 'CHIRAL <noreply@chiralrobotics.com>',
    to: 'sales@chiralrobotics.com',
    subject: `New Lead: ${company}`,
    text: `
      New lead from website:
      Name: ${name}
      Email: ${email}
      Company: ${company}
      Message: ${message}
    `
  });
  
  // Auto-reply to prospect
  await resend.emails.send({
    from: 'CHIRAL <noreply@chiralrobotics.com>',
    to: email,
    subject: 'Thank you for contacting CHIRAL',
    text: `Hi ${name}, We received your inquiry and will respond within 24 hours.`
  });
  
  return Response.json({ success: true });
}
```

---

### AGENT 3: LEAD STORAGE SPECIALIST
**Single Focus**: Store leads so they're never lost

**Tasks** (1-2 hours):
```
1. Simple JSON File Storage (Fastest MVP)
   - Store leads in /data/leads.json
   - Append each submission
   - Include timestamp
   - Backup daily

2. OR Supabase (If time allows)
   - Create free account
   - Single table: leads
   - Columns: name, email, company, message, created_at
   - Simple insert on form submit
```

**Simplest Implementation**:
```javascript
// /api/contact.js addition
import fs from 'fs';
import path from 'path';

// Store lead locally
const lead = {
  name, email, company, message,
  timestamp: new Date().toISOString()
};

const leadsFile = path.join(process.cwd(), 'data', 'leads.json');
const existingLeads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
existingLeads.push(lead);
fs.writeFileSync(leadsFile, JSON.stringify(existingLeads, null, 2));
```

---

### AGENT 4: BASIC ANALYTICS
**Single Focus**: Know if anyone visits the site

**Tasks** (30 minutes):
```
1. Add Google Analytics 4
   - Create GA4 property
   - Add tracking code to index.html
   - Track page views only

2. Track Form Submissions
   - Add event: form_submit
   - Track which form (contact/quote/newsletter)
   - No complex setup needed
```

**Implementation**:
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## SIMPLIFIED IMPLEMENTATION PLAN

### Day 1 Morning (2 hours):
1. **Fix Contact Form** 
   - Make it POST to /api/contact
   - Add loading/success states
   - Test it works

### Day 1 Afternoon (2 hours):
2. **Email Integration**
   - Set up Resend account
   - Create API endpoint
   - Send test emails

### Day 1 Evening (1 hour):
3. **Lead Storage**
   - Create leads.json file
   - Append each submission
   - Verify no data loss

### Day 2 Morning (1 hour):
4. **Add More Forms**
   - Product inquiry form
   - Newsletter signup
   - Use same backend

### Day 2 Afternoon (30 min):
5. **Analytics**
   - Add GA4 code
   - Track form events
   - Verify tracking works

---

## WHAT NOT TO DO (Save for Later)

❌ NO bilingual Hebrew/English toggle
❌ NO WhatsApp integration  
❌ NO phone number fields
❌ NO complex CRM integration
❌ NO payment processing
❌ NO user accounts/login
❌ NO fancy animations
❌ NO A/B testing
❌ NO heatmaps
❌ NO case studies
❌ NO ROI calculators
❌ NO testimonials section

Just make the forms work and capture emails!

---

## SUCCESS CRITERIA FOR MVP

✅ Contact form sends emails (not console.log)
✅ Leads are saved (never lost)
✅ Sales team gets notified instantly
✅ User gets confirmation email
✅ Basic analytics shows traffic

If these 5 things work, the MVP is complete.

---

## TESTING CHECKLIST

1. Fill out contact form → Email arrives? → Lead saved?
2. Fill out product inquiry → Email arrives? → Lead saved?
3. Sign up for newsletter → Email arrives? → Lead saved?
4. Check GA4 → Events tracking?
5. Check leads.json → All test leads present?

---

## EMERGENCY 1-HOUR FIX

If you only have 1 hour, just do this:

```javascript
// In Contact.jsx, replace console.log with:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Send to webhook (Zapier, Make, or n8n)
  await fetch('https://hooks.zapier.com/hooks/catch/xxx/yyy/', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  
  alert('Thank you! We will contact you soon.');
  setFormData({});
};
```

This alone converts the site from 0% to 100% lead capture.

---

## FILES TO MODIFY

1. `/src/components/pages/Contact.jsx` - Fix form submission
2. `/api/contact.js` - Create new API route (or use Vercel functions)
3. `/src/components/Footer.jsx` - Add newsletter signup
4. `/src/components/pages/Products.jsx` - Add inquiry form
5. `/index.html` - Add GA4 tracking code
6. `/.env.local` - Add RESEND_API_KEY

Total: ~200 lines of code changes

---

## FINAL NOTES

This MVP system prompt focuses on ONE thing: capturing leads via email. Everything else can wait. The goal is to go from 0% lead capture to 100% lead capture in the fastest possible time with the least complexity.

Remember: A simple form that works is infinitely better than a complex system that doesn't.