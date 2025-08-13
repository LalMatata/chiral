from flask import Blueprint, request, jsonify, current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, ValidationError, validate
from datetime import datetime, timedelta
import json
import logging

from src.models.lead import db, Lead, DemoRequest, LeadActivity, ContactForm
from src.utils.email_service import send_lead_notification, send_demo_confirmation
from src.utils.crm_service import sync_lead_to_crm
from src.utils.validators import validate_email, validate_phone

# 创建蓝图
leads_bp = Blueprint('leads', __name__)

# 设置日志
logger = logging.getLogger(__name__)

# 数据验证Schema
class LeadSchema(Schema):
    """线索数据验证Schema"""
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    phone = fields.Str(validate=validate.Length(max=50))
    company = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    job_title = fields.Str(validate=validate.Length(max=100))
    company_size = fields.Str(validate=validate.OneOf([
        'startup', 'small', 'medium', 'large', 'enterprise'
    ]))
    industry = fields.Str(validate=validate.OneOf([
        'power_utilities', 'manufacturing', 'security', 'research', 'defense', 'other'
    ]))
    location = fields.Str(validate=validate.Length(max=255))
    website = fields.Url()
    application_area = fields.Str(validate=validate.Length(max=100))
    project_timeline = fields.Str(validate=validate.OneOf([
        'immediate', 'short_term', 'long_term'
    ]))
    budget_range = fields.Str(validate=validate.OneOf([
        'under_100k', '100k_500k', '500k_1m', 'over_1m'
    ]))
    requirements = fields.Str()
    challenges = fields.Str()
    utm_source = fields.Str(validate=validate.Length(max=100))
    utm_medium = fields.Str(validate=validate.Length(max=100))
    utm_campaign = fields.Str(validate=validate.Length(max=100))

class DemoRequestSchema(Schema):
    """演示请求数据验证Schema"""
    demo_type = fields.Str(required=True, validate=validate.OneOf([
        'virtual', 'onsite', 'pilot'
    ]))
    preferred_date = fields.DateTime()
    attendees_count = fields.Int(validate=validate.Range(min=1, max=50))
    special_requirements = fields.Str()
    interested_products = fields.Str()
    specific_applications = fields.Str()

class ContactFormSchema(Schema):
    """联系表单数据验证Schema"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    email = fields.Email(required=True)
    phone = fields.Str(validate=validate.Length(max=50))
    company = fields.Str(validate=validate.Length(max=255))
    subject = fields.Str(validate=validate.Length(max=255))
    message = fields.Str(required=True, validate=validate.Length(min=1))
    form_type = fields.Str(validate=validate.OneOf([
        'contact', 'support', 'partnership'
    ]))

# 初始化Schema实例
lead_schema = LeadSchema()
demo_request_schema = DemoRequestSchema()
contact_form_schema = ContactFormSchema()

def get_client_info(request):
    """获取客户端信息"""
    return {
        'ip_address': get_remote_address(),
        'user_agent': request.headers.get('User-Agent', ''),
        'referrer': request.headers.get('Referer', '')
    }

def log_lead_activity(lead_id, activity_type, description, data=None):
    """记录线索活动"""
    try:
        client_info = get_client_info(request)
        activity = LeadActivity(
            lead_id=lead_id,
            activity_type=activity_type,
            activity_description=description,
            activity_data=json.dumps(data) if data else None,
            user_agent=client_info['user_agent'],
            ip_address=client_info['ip_address'],
            referrer=client_info['referrer'],
            created_by='system'
        )
        db.session.add(activity)
        db.session.commit()
    except Exception as e:
        logger.error(f"Failed to log activity: {e}")

@leads_bp.route('/leads', methods=['POST'])
def create_lead():
    """创建新线索"""
    try:
        # 验证请求数据
        data = lead_schema.load(request.json)
        
        # 检查邮箱是否已存在
        existing_lead = Lead.query.filter_by(email=data['email']).first()
        if existing_lead:
            # 更新现有线索信息
            for key, value in data.items():
                if value is not None:
                    setattr(existing_lead, key, value)
            existing_lead.updated_at = datetime.utcnow()
            lead = existing_lead
        else:
            # 创建新线索
            lead = Lead(**data)
            db.session.add(lead)
        
        # 计算线索评分
        lead.calculate_lead_score()
        
        # 保存到数据库
        db.session.commit()
        
        # 记录活动
        log_lead_activity(
            lead.id, 
            'lead_created', 
            f'New lead created: {lead.full_name} from {lead.company}',
            data
        )
        
        # 异步发送通知邮件
        try:
            send_lead_notification(lead)
        except Exception as e:
            logger.error(f"Failed to send lead notification: {e}")
        
        # 异步同步到CRM
        try:
            sync_lead_to_crm(lead)
        except Exception as e:
            logger.error(f"Failed to sync lead to CRM: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Lead created successfully',
            'lead_id': lead.id,
            'lead_score': lead.lead_score
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': e.messages
        }), 400
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@leads_bp.route('/leads/<int:lead_id>/demo', methods=['POST'])
def create_demo_request(lead_id):
    """创建演示请求"""
    try:
        # 验证线索是否存在
        lead = Lead.query.get_or_404(lead_id)
        
        # 验证请求数据
        data = demo_request_schema.load(request.json)
        
        # 创建演示请求
        demo_request = DemoRequest(
            lead_id=lead_id,
            **data
        )
        db.session.add(demo_request)
        db.session.commit()
        
        # 记录活动
        log_lead_activity(
            lead_id,
            'demo_requested',
            f'Demo requested: {data["demo_type"]} demo',
            data
        )
        
        # 发送确认邮件
        try:
            send_demo_confirmation(lead, demo_request)
        except Exception as e:
            logger.error(f"Failed to send demo confirmation: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Demo request created successfully',
            'demo_request_id': demo_request.id
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': e.messages
        }), 400
    except Exception as e:
        logger.error(f"Error creating demo request: {e}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@leads_bp.route('/contact', methods=['POST'])
def create_contact_form():
    """处理联系表单提交"""
    try:
        # 验证请求数据
        data = contact_form_schema.load(request.json)
        
        # 获取客户端信息
        client_info = get_client_info(request)
        
        # 创建联系表单记录
        contact_form = ContactForm(
            **data,
            **client_info
        )
        db.session.add(contact_form)
        db.session.commit()
        
        # 发送通知邮件
        try:
            send_contact_notification(contact_form)
        except Exception as e:
            logger.error(f"Failed to send contact notification: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Contact form submitted successfully',
            'form_id': contact_form.id
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': e.messages
        }), 400
    except Exception as e:
        logger.error(f"Error processing contact form: {e}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@leads_bp.route('/leads', methods=['GET'])
def get_leads():
    """获取线索列表（管理员功能）"""
    try:
        # 分页参数
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # 过滤参数
        status = request.args.get('status')
        industry = request.args.get('industry')
        company_size = request.args.get('company_size')
        min_score = request.args.get('min_score', type=int)
        
        # 构建查询
        query = Lead.query.filter_by(is_active=True)
        
        if status:
            query = query.filter(Lead.status == status)
        if industry:
            query = query.filter(Lead.industry == industry)
        if company_size:
            query = query.filter(Lead.company_size == company_size)
        if min_score:
            query = query.filter(Lead.lead_score >= min_score)
        
        # 排序
        query = query.order_by(Lead.lead_score.desc(), Lead.created_at.desc())
        
        # 分页
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        leads = [lead.to_dict() for lead in pagination.items]
        
        return jsonify({
            'success': True,
            'leads': leads,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })
        
    except Exception as e:
        logger.error(f"Error fetching leads: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@leads_bp.route('/leads/<int:lead_id>', methods=['GET'])
def get_lead(lead_id):
    """获取单个线索详情"""
    try:
        lead = Lead.query.get_or_404(lead_id)
        
        # 获取相关的演示请求和活动
        demo_requests = [demo.to_dict() for demo in lead.demo_requests]
        activities = [activity.to_dict() for activity in lead.activities[-10:]]  # 最近10条活动
        notes = [note.to_dict() for note in lead.notes]
        
        return jsonify({
            'success': True,
            'lead': lead.to_dict(),
            'demo_requests': demo_requests,
            'activities': activities,
            'notes': notes
        })
        
    except Exception as e:
        logger.error(f"Error fetching lead: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@leads_bp.route('/leads/<int:lead_id>', methods=['PUT'])
def update_lead(lead_id):
    """更新线索信息"""
    try:
        lead = Lead.query.get_or_404(lead_id)
        
        # 验证请求数据
        data = lead_schema.load(request.json, partial=True)
        
        # 更新线索信息
        for key, value in data.items():
            if value is not None:
                setattr(lead, key, value)
        
        lead.updated_at = datetime.utcnow()
        
        # 重新计算评分
        lead.calculate_lead_score()
        
        db.session.commit()
        
        # 记录活动
        log_lead_activity(
            lead_id,
            'lead_updated',
            'Lead information updated',
            data
        )
        
        return jsonify({
            'success': True,
            'message': 'Lead updated successfully',
            'lead': lead.to_dict()
        })
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': e.messages
        }), 400
    except Exception as e:
        logger.error(f"Error updating lead: {e}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@leads_bp.route('/analytics/leads', methods=['GET'])
def get_lead_analytics():
    """获取线索分析数据"""
    try:
        # 时间范围
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # 基础统计
        total_leads = Lead.query.filter_by(is_active=True).count()
        new_leads = Lead.query.filter(
            Lead.created_at >= start_date,
            Lead.is_active == True
        ).count()
        
        # 按状态统计
        status_stats = db.session.query(
            Lead.status,
            db.func.count(Lead.id)
        ).filter_by(is_active=True).group_by(Lead.status).all()
        
        # 按行业统计
        industry_stats = db.session.query(
            Lead.industry,
            db.func.count(Lead.id)
        ).filter_by(is_active=True).group_by(Lead.industry).all()
        
        # 按评分分布统计
        score_ranges = [
            (0, 10), (11, 20), (21, 30), (31, 40), (41, 50)
        ]
        score_stats = []
        for min_score, max_score in score_ranges:
            count = Lead.query.filter(
                Lead.lead_score >= min_score,
                Lead.lead_score <= max_score,
                Lead.is_active == True
            ).count()
            score_stats.append({
                'range': f'{min_score}-{max_score}',
                'count': count
            })
        
        # 转化率统计
        demo_requests_count = DemoRequest.query.join(Lead).filter(
            Lead.is_active == True
        ).count()
        
        conversion_rate = (demo_requests_count / total_leads * 100) if total_leads > 0 else 0
        
        return jsonify({
            'success': True,
            'analytics': {
                'total_leads': total_leads,
                'new_leads': new_leads,
                'demo_requests': demo_requests_count,
                'conversion_rate': round(conversion_rate, 2),
                'status_distribution': dict(status_stats),
                'industry_distribution': dict(industry_stats),
                'score_distribution': score_stats
            }
        })
        
    except Exception as e:
        logger.error(f"Error fetching analytics: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

# 错误处理
@leads_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Resource not found'
    }), 404

@leads_bp.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        'success': False,
        'message': 'Rate limit exceeded. Please try again later.'
    }), 429

