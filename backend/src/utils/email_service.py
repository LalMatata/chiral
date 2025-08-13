from flask import current_app, render_template_string
from flask_mail import Mail, Message
import logging
from datetime import datetime
import os

# 设置日志
logger = logging.getLogger(__name__)

# 初始化邮件服务
mail = Mail()

def init_mail(app):
    """初始化邮件服务"""
    mail.init_app(app)

def send_lead_notification(lead):
    """发送新线索通知邮件给销售团队"""
    try:
        # 邮件主题
        subject = f"新线索通知: {lead.company} - {lead.full_name}"
        
        # 邮件收件人
        recipients = [
            current_app.config.get('SALES_EMAIL', 'sales@chiral-robotics.com'),
            current_app.config.get('ADMIN_EMAIL', 'admin@chiral-robotics.com')
        ]
        
        # 邮件内容模板
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .lead-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .score-high { color: #dc2626; font-weight: bold; }
                .score-medium { color: #ea580c; font-weight: bold; }
                .score-low { color: #16a34a; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; }
                td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: bold; width: 30%; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚀 CHIRAL - 新线索通知</h1>
            </div>
            
            <div class="content">
                <h2>新的潜在客户信息</h2>
                
                <div class="lead-info">
                    <h3>线索评分: 
                        <span class="{% if lead.lead_score >= 30 %}score-high{% elif lead.lead_score >= 20 %}score-medium{% else %}score-low{% endif %}">
                            {{ lead.lead_score }}/50
                        </span>
                    </h3>
                </div>
                
                <table>
                    <tr>
                        <td class="label">姓名:</td>
                        <td>{{ lead.full_name }}</td>
                    </tr>
                    <tr>
                        <td class="label">邮箱:</td>
                        <td><a href="mailto:{{ lead.email }}">{{ lead.email }}</a></td>
                    </tr>
                    <tr>
                        <td class="label">电话:</td>
                        <td>{% if lead.phone %}<a href="tel:{{ lead.phone }}">{{ lead.phone }}</a>{% else %}未提供{% endif %}</td>
                    </tr>
                    <tr>
                        <td class="label">公司:</td>
                        <td>{{ lead.company }}</td>
                    </tr>
                    <tr>
                        <td class="label">职位:</td>
                        <td>{{ lead.job_title or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">公司规模:</td>
                        <td>{{ lead.company_size or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">行业:</td>
                        <td>{{ lead.industry or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">地区:</td>
                        <td>{{ lead.location or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">应用领域:</td>
                        <td>{{ lead.application_area or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">项目时间线:</td>
                        <td>{{ lead.project_timeline or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">预算范围:</td>
                        <td>{{ lead.budget_range or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">创建时间:</td>
                        <td>{{ lead.created_at.strftime('%Y-%m-%d %H:%M:%S') }}</td>
                    </tr>
                </table>
                
                {% if lead.requirements %}
                <div class="lead-info">
                    <h4>具体需求:</h4>
                    <p>{{ lead.requirements }}</p>
                </div>
                {% endif %}
                
                {% if lead.challenges %}
                <div class="lead-info">
                    <h4>面临挑战:</h4>
                    <p>{{ lead.challenges }}</p>
                </div>
                {% endif %}
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="mailto:{{ lead.email }}?subject=CHIRAL机器人解决方案咨询" 
                       style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        立即联系客户
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>此邮件由CHIRAL客户关系管理系统自动发送</p>
                <p>如有问题，请联系技术支持</p>
            </div>
        </body>
        </html>
        """
        
        # 渲染邮件内容
        html_content = render_template_string(html_template, lead=lead)
        
        # 创建邮件消息
        msg = Message(
            subject=subject,
            recipients=recipients,
            html=html_content,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER')
        )
        
        # 发送邮件
        mail.send(msg)
        logger.info(f"Lead notification sent for {lead.email}")
        
    except Exception as e:
        logger.error(f"Failed to send lead notification: {e}")
        raise

def send_demo_confirmation(lead, demo_request):
    """发送演示确认邮件给客户"""
    try:
        # 邮件主题
        subject = f"CHIRAL机器人演示确认 - {demo_request.demo_type.title()} Demo"
        
        # 邮件收件人
        recipients = [lead.email]
        
        # 抄送销售团队
        cc = [current_app.config.get('SALES_EMAIL', 'sales@chiral-robotics.com')]
        
        # 邮件内容模板
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .demo-info { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2563eb; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
                .contact-info { background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🤖 CHIRAL机器人演示确认</h1>
            </div>
            
            <div class="content">
                <h2>尊敬的 {{ lead.full_name }}，</h2>
                
                <p>感谢您对CHIRAL四足机器人解决方案的关注！我们已收到您的演示请求，我们的团队将尽快与您联系安排具体的演示时间。</p>
                
                <div class="demo-info">
                    <h3>演示请求详情:</h3>
                    <ul>
                        <li><strong>演示类型:</strong> {{ demo_request.demo_type.title() }} Demo</li>
                        <li><strong>期望日期:</strong> {% if demo_request.preferred_date %}{{ demo_request.preferred_date.strftime('%Y年%m月%d日') }}{% else %}待商议{% endif %}</li>
                        <li><strong>参与人数:</strong> {{ demo_request.attendees_count }}人</li>
                        {% if demo_request.interested_products %}
                        <li><strong>感兴趣的产品:</strong> {{ demo_request.interested_products }}</li>
                        {% endif %}
                        {% if demo_request.specific_applications %}
                        <li><strong>具体应用:</strong> {{ demo_request.specific_applications }}</li>
                        {% endif %}
                    </ul>
                </div>
                
                {% if demo_request.special_requirements %}
                <div class="demo-info">
                    <h4>特殊要求:</h4>
                    <p>{{ demo_request.special_requirements }}</p>
                </div>
                {% endif %}
                
                <h3>接下来的步骤:</h3>
                <ol>
                    <li>我们的销售工程师将在24小时内与您联系</li>
                    <li>确认演示的具体时间和地点</li>
                    <li>根据您的需求定制演示内容</li>
                    <li>进行产品演示和技术交流</li>
                </ol>
                
                <div class="contact-info">
                    <h4>联系信息:</h4>
                    <p>
                        <strong>销售热线:</strong> +972-3-XXX-XXXX<br>
                        <strong>邮箱:</strong> sales@chiral-robotics.com<br>
                        <strong>地址:</strong> Technology Park, Tel Aviv, Israel
                    </p>
                </div>
                
                <p>如果您有任何紧急问题或需要更改演示安排，请随时联系我们。</p>
                
                <p>期待与您的会面！</p>
                
                <p>
                    此致<br>
                    CHIRAL机器人团队
                </p>
            </div>
            
            <div class="footer">
                <p>CHIRAL Robotics Solutions Ltd.</p>
                <p>Technology Park, Tel Aviv, Israel</p>
                <p>此邮件由CHIRAL客户关系管理系统自动发送</p>
            </div>
        </body>
        </html>
        """
        
        # 渲染邮件内容
        html_content = render_template_string(html_template, lead=lead, demo_request=demo_request)
        
        # 创建邮件消息
        msg = Message(
            subject=subject,
            recipients=recipients,
            cc=cc,
            html=html_content,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER')
        )
        
        # 发送邮件
        mail.send(msg)
        logger.info(f"Demo confirmation sent to {lead.email}")
        
    except Exception as e:
        logger.error(f"Failed to send demo confirmation: {e}")
        raise

def send_contact_notification(contact_form):
    """发送联系表单通知邮件"""
    try:
        # 邮件主题
        subject = f"网站联系表单: {contact_form.subject or '新的咨询'}"
        
        # 邮件收件人
        recipients = [
            current_app.config.get('SALES_EMAIL', 'sales@chiral-robotics.com'),
            current_app.config.get('ADMIN_EMAIL', 'admin@chiral-robotics.com')
        ]
        
        # 邮件内容模板
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .form-info { background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; }
                td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: bold; width: 30%; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📧 网站联系表单</h1>
            </div>
            
            <div class="content">
                <h2>新的客户咨询</h2>
                
                <table>
                    <tr>
                        <td class="label">姓名:</td>
                        <td>{{ contact_form.name }}</td>
                    </tr>
                    <tr>
                        <td class="label">邮箱:</td>
                        <td><a href="mailto:{{ contact_form.email }}">{{ contact_form.email }}</a></td>
                    </tr>
                    <tr>
                        <td class="label">电话:</td>
                        <td>{% if contact_form.phone %}<a href="tel:{{ contact_form.phone }}">{{ contact_form.phone }}</a>{% else %}未提供{% endif %}</td>
                    </tr>
                    <tr>
                        <td class="label">公司:</td>
                        <td>{{ contact_form.company or '未提供' }}</td>
                    </tr>
                    <tr>
                        <td class="label">主题:</td>
                        <td>{{ contact_form.subject or '无主题' }}</td>
                    </tr>
                    <tr>
                        <td class="label">表单类型:</td>
                        <td>{{ contact_form.form_type or 'contact' }}</td>
                    </tr>
                    <tr>
                        <td class="label">提交时间:</td>
                        <td>{{ contact_form.created_at.strftime('%Y-%m-%d %H:%M:%S') }}</td>
                    </tr>
                </table>
                
                <div class="form-info">
                    <h4>消息内容:</h4>
                    <p>{{ contact_form.message }}</p>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="mailto:{{ contact_form.email }}?subject=Re: {{ contact_form.subject or '您的咨询' }}" 
                       style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        回复客户
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>此邮件由CHIRAL网站联系表单自动发送</p>
            </div>
        </body>
        </html>
        """
        
        # 渲染邮件内容
        html_content = render_template_string(html_template, contact_form=contact_form)
        
        # 创建邮件消息
        msg = Message(
            subject=subject,
            recipients=recipients,
            html=html_content,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER')
        )
        
        # 发送邮件
        mail.send(msg)
        logger.info(f"Contact form notification sent for {contact_form.email}")
        
    except Exception as e:
        logger.error(f"Failed to send contact notification: {e}")
        raise

def send_welcome_email(lead):
    """发送欢迎邮件给新线索"""
    try:
        # 邮件主题
        subject = "欢迎了解CHIRAL四足机器人解决方案"
        
        # 邮件收件人
        recipients = [lead.email]
        
        # 邮件内容模板
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .highlight { background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
                .cta-button { background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🤖 欢迎来到CHIRAL</h1>
            </div>
            
            <div class="content">
                <h2>尊敬的 {{ lead.full_name }}，</h2>
                
                <p>感谢您对CHIRAL四足机器人解决方案的关注！我们很高兴为您介绍我们的创新产品。</p>
                
                <div class="highlight">
                    <h3>为什么选择CHIRAL？</h3>
                    <ul>
                        <li>🏭 专为以色列工业环境设计</li>
                        <li>🔧 全面的自动化巡检解决方案</li>
                        <li>🛡️ 军用级可靠性和安全性</li>
                        <li>📊 实时数据分析和报告</li>
                        <li>🔄 24/7技术支持服务</li>
                    </ul>
                </div>
                
                <h3>我们的产品系列:</h3>
                <ul>
                    <li><strong>X30系列</strong> - 工业旗舰产品，适用于最严苛的环境</li>
                    <li><strong>X20系列</strong> - 巡检专家，完美的移动性和载荷能力</li>
                    <li><strong>Lite3系列</strong> - 研究平台，适合学术和小型应用</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://uzpeukur.manus.space/demo" class="cta-button">
                        预约产品演示
                    </a>
                    <a href="https://uzpeukur.manus.space/products" class="cta-button" style="background-color: #059669;">
                        了解产品详情
                    </a>
                </div>
                
                <p>我们的团队将很快与您联系，为您提供个性化的解决方案建议。</p>
                
                <p>
                    此致<br>
                    CHIRAL团队
                </p>
            </div>
            
            <div class="footer">
                <p>CHIRAL Robotics Solutions Ltd.</p>
                <p>Technology Park, Tel Aviv, Israel</p>
                <p>如不希望接收此类邮件，请回复"退订"</p>
            </div>
        </body>
        </html>
        """
        
        # 渲染邮件内容
        html_content = render_template_string(html_template, lead=lead)
        
        # 创建邮件消息
        msg = Message(
            subject=subject,
            recipients=recipients,
            html=html_content,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER')
        )
        
        # 发送邮件
        mail.send(msg)
        logger.info(f"Welcome email sent to {lead.email}")
        
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
        raise

