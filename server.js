import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend with API key (will be added to .env)
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// JSON error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format'
    });
  }
  next();
});

// Contact form validation middleware
const validateContactForm = (req, res, next) => {
  const { companyName, contactPerson, email, formType } = req.body;
  
  // Required fields validation
  if (!companyName || !contactPerson || !email || !formType) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: companyName, contactPerson, email, formType',
      received: req.body
    });
  }
  
  // Email format validation  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }
  
  // Form type validation
  if (!['demo', 'sales'].includes(formType)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid form type. Must be "demo" or "sales"'
    });
  }
  
  next();
};

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

// Contact form endpoint
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const formData = req.body;
    
    // Store lead locally
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
    leads.push({
      ...formData,
      receivedAt: new Date().toISOString()
    });
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    
    // If Resend API key is configured, send emails
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
      // Email to sales team
      await resend.emails.send({
        from: 'CHIRAL <noreply@chiral-robotics.com>',
        to: process.env.SALES_EMAIL || 'sales@chiral-robotics.com',
        subject: `New ${formData.formType === 'demo' ? 'Demo Request' : 'Sales Inquiry'}: ${formData.companyName}`,
        html: formatEmailToSales(formData)
      });
      
      // Auto-reply to prospect
      await resend.emails.send({
        from: 'CHIRAL <noreply@chiral-robotics.com>',
        to: formData.email,
        subject: 'Thank you for contacting CHIRAL Robotics',
        html: formatAutoReply(formData)
      });
    } else {
      console.log('Resend API key not configured - emails not sent');
      console.log('Lead saved locally:', formData);
    }
    
    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ success: false, error: 'Failed to process form submission' });
  }
});

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
  
  return `
    <h2>New ${isDemo ? 'Demo Request' : 'Sales Inquiry'}</h2>
    
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
  
  return `
    <h2>Thank you for contacting CHIRAL Robotics</h2>
    
    <p>Dear ${formData.contactPerson},</p>
    
    <p>We have received your ${isDemo ? 'demo request' : 'sales inquiry'} and appreciate your interest in CHIRAL's advanced robotics solutions.</p>
    
    <p>Our team will review your requirements and contact you within 24 hours to discuss how we can help address your operational needs.</p>
    
    ${isDemo ? `
      <p>In preparation for the demo, you may want to:</p>
      <ul>
        <li>Prepare specific questions about your use cases</li>
        <li>Gather information about your operational environment</li>
        <li>Identify key stakeholders who should attend</li>
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
    www.chiral-robotics.com</small></p>
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Resend API Key configured: ${!!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here'}`);
});