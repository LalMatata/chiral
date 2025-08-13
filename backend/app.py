from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
LEADS_FILE = 'leads.json'
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email': os.environ.get('EMAIL_USER', 'sales@chiral-robotics.com'),
    'password': os.environ.get('EMAIL_PASSWORD', 'your-app-password'),
    'recipient': os.environ.get('SALES_EMAIL', 'sales@chiral-robotics.com')
}

def load_leads():
    """Load existing leads from JSON file"""
    if os.path.exists(LEADS_FILE):
        with open(LEADS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_lead(lead_data):
    """Save new lead to JSON file"""
    leads = load_leads()
    lead_data['id'] = len(leads) + 1
    lead_data['timestamp'] = datetime.now().isoformat()
    lead_data['status'] = 'new'
    leads.append(lead_data)
    
    with open(LEADS_FILE, 'w') as f:
        json.dump(leads, f, indent=2)
    
    return lead_data

def send_notification_email(lead_data):
    """Send email notification to sales team"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = EMAIL_CONFIG['recipient']
        msg['Subject'] = f"New Lead: {lead_data['company']} - {lead_data['industry']}"
        
        # Create email body
        body = f"""
New lead received from CHIRAL website:

Contact Information:
- Name: {lead_data['name']}
- Email: {lead_data['email']}
- Company: {lead_data['company']}
- Phone: {lead_data.get('phone', 'Not provided')}
- Industry: {lead_data['industry']}

Project Details:
- Budget Range: {lead_data.get('budget', 'Not specified')}
- Timeline: {lead_data.get('timeline', 'Not specified')}
- Message: {lead_data['message']}

Lead ID: {lead_data['id']}
Timestamp: {lead_data['timestamp']}

Please follow up within 24 hours.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
        text = msg.as_string()
        server.sendmail(EMAIL_CONFIG['email'], EMAIL_CONFIG['recipient'], text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

def send_confirmation_email(lead_data):
    """Send confirmation email to the lead"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = lead_data['email']
        msg['Subject'] = "Thank you for your interest in CHIRAL Robotics"
        
        body = f"""
Dear {lead_data['name']},

Thank you for your interest in CHIRAL's advanced quadruped robotics solutions!

We have received your inquiry and our technical team will review your requirements. You can expect to hear from us within 24 hours to discuss your specific needs and schedule a demonstration.

Your inquiry details:
- Company: {lead_data['company']}
- Industry: {lead_data['industry']}
- Budget Range: {lead_data.get('budget', 'Not specified')}
- Timeline: {lead_data.get('timeline', 'Not specified')}

What happens next:
• Our technical team will review your requirements
• We'll prepare a customized solution proposal
• Schedule a live demonstration of our robots
• Provide detailed pricing and implementation timeline

If you have any immediate questions, please don't hesitate to contact us at {EMAIL_CONFIG['email']} or +1 (555) 123-4567.

Best regards,
CHIRAL Robotics Sales Team

---
CHIRAL Robotics
Advanced Quadruped Robotics Solutions
123 Innovation Drive, Tech Valley, CA 94000
Phone: +1 (555) 123-4567
Email: sales@chiral-robotics.com
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
        text = msg.as_string()
        server.sendmail(EMAIL_CONFIG['email'], lead_data['email'], text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Confirmation email sending failed: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'CHIRAL Lead Collection API'
    })

@app.route('/api/leads', methods=['POST'])
def submit_lead():
    """Submit a new lead"""
    try:
        # Get form data
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'company', 'industry', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate email format
        email = data.get('email')
        if '@' not in email or '.' not in email:
            return jsonify({
                'error': 'Invalid email format'
            }), 400
        
        # Save lead
        lead_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'company': data.get('company'),
            'phone': data.get('phone', ''),
            'industry': data.get('industry'),
            'budget': data.get('budget', ''),
            'timeline': data.get('timeline', ''),
            'message': data.get('message')
        }
        
        saved_lead = save_lead(lead_data)
        
        # Send notifications
        notification_sent = send_notification_email(saved_lead)
        confirmation_sent = send_confirmation_email(saved_lead)
        
        return jsonify({
            'success': True,
            'message': 'Lead submitted successfully',
            'lead_id': saved_lead['id'],
            'notifications': {
                'sales_team': notification_sent,
                'customer': confirmation_sent
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/leads', methods=['GET'])
def get_leads():
    """Get all leads (for admin use)"""
    try:
        leads = load_leads()
        return jsonify({
            'success': True,
            'count': len(leads),
            'leads': leads
        })
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/leads/<int:lead_id>', methods=['GET'])
def get_lead(lead_id):
    """Get specific lead by ID"""
    try:
        leads = load_leads()
        lead = next((l for l in leads if l['id'] == lead_id), None)
        
        if not lead:
            return jsonify({
                'error': 'Lead not found'
            }), 404
        
        return jsonify({
            'success': True,
            'lead': lead
        })
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get lead statistics"""
    try:
        leads = load_leads()
        
        # Calculate statistics
        total_leads = len(leads)
        industries = {}
        budgets = {}
        timelines = {}
        
        for lead in leads:
            # Industry stats
            industry = lead.get('industry', 'Unknown')
            industries[industry] = industries.get(industry, 0) + 1
            
            # Budget stats
            budget = lead.get('budget', 'Not specified')
            budgets[budget] = budgets.get(budget, 0) + 1
            
            # Timeline stats
            timeline = lead.get('timeline', 'Not specified')
            timelines[timeline] = timelines.get(timeline, 0) + 1
        
        return jsonify({
            'success': True,
            'stats': {
                'total_leads': total_leads,
                'by_industry': industries,
                'by_budget': budgets,
                'by_timeline': timelines
            }
        })
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Create leads file if it doesn't exist
    if not os.path.exists(LEADS_FILE):
        with open(LEADS_FILE, 'w') as f:
            json.dump([], f)
    
    # Run the app
    app.run(host='0.0.0.0', port=5001, debug=True)

