from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Lead(db.Model):
    """线索主表 - 存储潜在客户信息"""
    __tablename__ = 'leads'
    
    # 基本信息
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(50))
    
    # 公司信息
    company = db.Column(db.String(255), nullable=False)
    job_title = db.Column(db.String(100))
    company_size = db.Column(db.String(50))  # startup, small, medium, large, enterprise
    industry = db.Column(db.String(100))  # power_utilities, manufacturing, security, research
    location = db.Column(db.String(255))
    website = db.Column(db.String(255))
    
    # 项目信息
    application_area = db.Column(db.String(100))  # inspection, surveillance, research, etc.
    project_timeline = db.Column(db.String(50))  # immediate, short_term, long_term
    budget_range = db.Column(db.String(50))  # under_100k, 100k_500k, 500k_1m, over_1m
    requirements = db.Column(db.Text)
    challenges = db.Column(db.Text)
    
    # 线索管理
    lead_score = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='new')  # new, contacted, qualified, demo_scheduled, proposal_sent, closed_won, closed_lost
    source = db.Column(db.String(100), default='website')  # website, referral, trade_show, etc.
    utm_source = db.Column(db.String(100))
    utm_medium = db.Column(db.String(100))
    utm_campaign = db.Column(db.String(100))
    
    # 分配和跟进
    assigned_to = db.Column(db.String(100))  # 分配给的销售人员
    last_contact_date = db.Column(db.DateTime)
    next_follow_up_date = db.Column(db.DateTime)
    
    # 系统字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # 关联关系
    demo_requests = relationship('DemoRequest', back_populates='lead', cascade='all, delete-orphan')
    activities = relationship('LeadActivity', back_populates='lead', cascade='all, delete-orphan')
    notes = relationship('LeadNote', back_populates='lead', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Lead {self.first_name} {self.last_name} - {self.company}>'
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def calculate_lead_score(self):
        """计算线索评分"""
        score = 0
        
        # 行业评分
        industry_scores = {
            'power_utilities': 10,
            'manufacturing': 8,
            'security': 9,
            'research': 6,
            'defense': 10
        }
        score += industry_scores.get(self.industry, 3)
        
        # 公司规模评分
        size_scores = {
            'enterprise': 10,
            'large': 8,
            'medium': 6,
            'small': 4,
            'startup': 2
        }
        score += size_scores.get(self.company_size, 3)
        
        # 预算评分
        budget_scores = {
            'over_1m': 10,
            '500k_1m': 8,
            '100k_500k': 6,
            'under_100k': 3
        }
        score += budget_scores.get(self.budget_range, 2)
        
        # 时间线评分
        timeline_scores = {
            'immediate': 10,
            'short_term': 8,
            'long_term': 4
        }
        score += timeline_scores.get(self.project_timeline, 2)
        
        # 更新评分
        self.lead_score = score
        return score
    
    def to_dict(self):
        """转换为字典格式"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'job_title': self.job_title,
            'company_size': self.company_size,
            'industry': self.industry,
            'location': self.location,
            'website': self.website,
            'application_area': self.application_area,
            'project_timeline': self.project_timeline,
            'budget_range': self.budget_range,
            'requirements': self.requirements,
            'challenges': self.challenges,
            'lead_score': self.lead_score,
            'status': self.status,
            'source': self.source,
            'assigned_to': self.assigned_to,
            'last_contact_date': self.last_contact_date.isoformat() if self.last_contact_date else None,
            'next_follow_up_date': self.next_follow_up_date.isoformat() if self.next_follow_up_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_active': self.is_active
        }

class DemoRequest(db.Model):
    """演示请求表"""
    __tablename__ = 'demo_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    
    # 演示详情
    demo_type = db.Column(db.String(50), nullable=False)  # virtual, onsite, pilot
    preferred_date = db.Column(db.DateTime)
    attendees_count = db.Column(db.Integer, default=1)
    special_requirements = db.Column(db.Text)
    
    # 产品兴趣
    interested_products = db.Column(db.String(255))  # x30,x20,lite3
    specific_applications = db.Column(db.Text)
    
    # 状态管理
    status = db.Column(db.String(50), default='pending')  # pending, scheduled, completed, cancelled
    scheduled_date = db.Column(db.DateTime)
    demo_notes = db.Column(db.Text)
    outcome = db.Column(db.String(100))  # interested, not_interested, needs_follow_up
    
    # 系统字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # 关联关系
    lead = relationship('Lead', back_populates='demo_requests')
    
    def __repr__(self):
        return f'<DemoRequest {self.id} - {self.demo_type} for Lead {self.lead_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'demo_type': self.demo_type,
            'preferred_date': self.preferred_date.isoformat() if self.preferred_date else None,
            'attendees_count': self.attendees_count,
            'special_requirements': self.special_requirements,
            'interested_products': self.interested_products,
            'specific_applications': self.specific_applications,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'demo_notes': self.demo_notes,
            'outcome': self.outcome,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class LeadActivity(db.Model):
    """线索活动跟踪表"""
    __tablename__ = 'lead_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    
    # 活动信息
    activity_type = db.Column(db.String(100), nullable=False)  # page_view, form_submit, email_open, call, meeting
    activity_description = db.Column(db.Text)
    activity_data = db.Column(db.Text)  # JSON string for additional data
    
    # 来源信息
    user_agent = db.Column(db.String(500))
    ip_address = db.Column(db.String(45))
    referrer = db.Column(db.String(500))
    
    # 系统字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_by = db.Column(db.String(100))  # system, user_email
    
    # 关联关系
    lead = relationship('Lead', back_populates='activities')
    
    def __repr__(self):
        return f'<LeadActivity {self.activity_type} for Lead {self.lead_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'activity_type': self.activity_type,
            'activity_description': self.activity_description,
            'activity_data': self.activity_data,
            'user_agent': self.user_agent,
            'ip_address': self.ip_address,
            'referrer': self.referrer,
            'created_at': self.created_at.isoformat(),
            'created_by': self.created_by
        }

class LeadNote(db.Model):
    """线索备注表"""
    __tablename__ = 'lead_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    
    # 备注内容
    note_type = db.Column(db.String(50), default='general')  # general, call, meeting, email
    subject = db.Column(db.String(255))
    content = db.Column(db.Text, nullable=False)
    
    # 系统字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_by = db.Column(db.String(100), nullable=False)  # 创建人员邮箱
    
    # 关联关系
    lead = relationship('Lead', back_populates='notes')
    
    def __repr__(self):
        return f'<LeadNote {self.id} for Lead {self.lead_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'note_type': self.note_type,
            'subject': self.subject,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'created_by': self.created_by
        }

class ContactForm(db.Model):
    """联系表单提交记录"""
    __tablename__ = 'contact_forms'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # 基本信息
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50))
    company = db.Column(db.String(255))
    
    # 表单内容
    subject = db.Column(db.String(255))
    message = db.Column(db.Text, nullable=False)
    form_type = db.Column(db.String(50), default='contact')  # contact, support, partnership
    
    # 状态管理
    status = db.Column(db.String(50), default='new')  # new, responded, closed
    response_sent = db.Column(db.Boolean, default=False)
    
    # 来源信息
    user_agent = db.Column(db.String(500))
    ip_address = db.Column(db.String(45))
    referrer = db.Column(db.String(500))
    
    # 系统字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<ContactForm {self.name} - {self.subject}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'subject': self.subject,
            'message': self.message,
            'form_type': self.form_type,
            'status': self.status,
            'response_sent': self.response_sent,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

