import re
import phonenumbers
from email_validator import validate_email as email_validate, EmailNotValidError
from marshmallow import ValidationError

def validate_email(email):
    """验证邮箱格式"""
    try:
        # 使用email-validator库进行验证
        valid = email_validate(email)
        return valid.email
    except EmailNotValidError as e:
        raise ValidationError(f"Invalid email: {str(e)}")

def validate_phone(phone):
    """验证电话号码格式"""
    if not phone:
        return None
    
    try:
        # 尝试解析电话号码
        parsed = phonenumbers.parse(phone, None)
        
        # 检查是否有效
        if not phonenumbers.is_valid_number(parsed):
            raise ValidationError("Invalid phone number format")
        
        # 返回格式化的电话号码
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    
    except phonenumbers.NumberParseException:
        # 如果解析失败，检查是否是简单的数字格式
        clean_phone = re.sub(r'[^\d+\-\(\)\s]', '', phone)
        if len(clean_phone) < 7:
            raise ValidationError("Phone number too short")
        return clean_phone

def validate_company_name(company):
    """验证公司名称"""
    if not company or len(company.strip()) < 2:
        raise ValidationError("Company name must be at least 2 characters long")
    
    # 检查是否包含恶意内容
    malicious_patterns = [
        r'<script',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe',
        r'<object'
    ]
    
    for pattern in malicious_patterns:
        if re.search(pattern, company, re.IGNORECASE):
            raise ValidationError("Company name contains invalid characters")
    
    return company.strip()

def validate_url(url):
    """验证URL格式"""
    if not url:
        return None
    
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    if not url_pattern.match(url):
        raise ValidationError("Invalid URL format")
    
    return url

def sanitize_text_input(text):
    """清理文本输入，防止XSS攻击"""
    if not text:
        return text
    
    # 移除潜在的恶意标签
    text = re.sub(r'<[^>]*>', '', text)
    
    # 移除JavaScript事件处理器
    text = re.sub(r'on\w+\s*=\s*["\'][^"\']*["\']', '', text, flags=re.IGNORECASE)
    
    # 移除javascript:协议
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    
    return text.strip()

def validate_lead_score_range(score):
    """验证线索评分范围"""
    if score is None:
        return 0
    
    if not isinstance(score, (int, float)):
        raise ValidationError("Lead score must be a number")
    
    if score < 0 or score > 100:
        raise ValidationError("Lead score must be between 0 and 100")
    
    return int(score)

def validate_date_range(start_date, end_date):
    """验证日期范围"""
    if start_date and end_date:
        if start_date > end_date:
            raise ValidationError("Start date must be before end date")
    
    return True

def validate_file_upload(file):
    """验证文件上传"""
    if not file:
        return None
    
    # 检查文件大小（16MB限制）
    max_size = 16 * 1024 * 1024  # 16MB
    if len(file.read()) > max_size:
        raise ValidationError("File size exceeds 16MB limit")
    
    # 重置文件指针
    file.seek(0)
    
    # 检查文件类型
    allowed_extensions = {
        'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'
    }
    
    filename = file.filename.lower()
    if not any(filename.endswith(f'.{ext}') for ext in allowed_extensions):
        raise ValidationError("File type not allowed")
    
    return file

def validate_ip_address(ip):
    """验证IP地址格式"""
    if not ip:
        return None
    
    # IPv4格式验证
    ipv4_pattern = re.compile(
        r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
        r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    )
    
    # IPv6格式验证（简化版）
    ipv6_pattern = re.compile(
        r'^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
    )
    
    if ipv4_pattern.match(ip) or ipv6_pattern.match(ip):
        return ip
    
    raise ValidationError("Invalid IP address format")

def validate_user_agent(user_agent):
    """验证User-Agent字符串"""
    if not user_agent:
        return None
    
    # 限制长度
    if len(user_agent) > 500:
        return user_agent[:500]
    
    # 移除潜在的恶意内容
    user_agent = sanitize_text_input(user_agent)
    
    return user_agent

def validate_utm_parameters(utm_source, utm_medium, utm_campaign):
    """验证UTM参数"""
    utm_params = {}
    
    if utm_source:
        utm_params['utm_source'] = sanitize_text_input(utm_source)[:100]
    
    if utm_medium:
        utm_params['utm_medium'] = sanitize_text_input(utm_medium)[:100]
    
    if utm_campaign:
        utm_params['utm_campaign'] = sanitize_text_input(utm_campaign)[:100]
    
    return utm_params

