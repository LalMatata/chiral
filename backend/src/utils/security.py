import hashlib
import secrets
import jwt
import re
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging

# 设置日志
logger = logging.getLogger(__name__)

# 初始化限流器
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def init_security(app):
    """初始化安全组件"""
    limiter.init_app(app)

class SecurityManager:
    """安全管理器"""
    
    @staticmethod
    def generate_api_key():
        """生成API密钥"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def hash_password(password):
        """密码哈希"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', 
                                          password.encode('utf-8'), 
                                          salt.encode('utf-8'), 
                                          100000)
        return f"{salt}:{password_hash.hex()}"
    
    @staticmethod
    def verify_password(password, hashed_password):
        """验证密码"""
        try:
            salt, password_hash = hashed_password.split(':')
            computed_hash = hashlib.pbkdf2_hmac('sha256',
                                              password.encode('utf-8'),
                                              salt.encode('utf-8'),
                                              100000)
            return computed_hash.hex() == password_hash
        except ValueError:
            return False
    
    @staticmethod
    def generate_jwt_token(user_id, expires_in=3600):
        """生成JWT令牌"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(seconds=expires_in),
            'iat': datetime.utcnow()
        }
        
        return jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
    
    @staticmethod
    def verify_jwt_token(token):
        """验证JWT令牌"""
        try:
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid JWT token")
            return None

def require_api_key(f):
    """API密钥验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return jsonify({
                'success': False,
                'message': 'API key required'
            }), 401
        
        # 这里应该从数据库验证API密钥
        # 简化示例，使用配置中的密钥
        valid_api_keys = current_app.config.get('VALID_API_KEYS', [])
        
        if api_key not in valid_api_keys:
            logger.warning(f"Invalid API key attempted: {api_key[:8]}...")
            return jsonify({
                'success': False,
                'message': 'Invalid API key'
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_auth(f):
    """JWT认证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({
                'success': False,
                'message': 'Authorization token required'
            }), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_id = SecurityManager.verify_jwt_token(token)
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'Invalid or expired token'
            }), 401
        
        # 将用户ID添加到请求上下文
        request.current_user_id = user_id
        
        return f(*args, **kwargs)
    
    return decorated_function

class InputSanitizer:
    """输入清理器"""
    
    @staticmethod
    def sanitize_html(text):
        """清理HTML标签"""
        if not text:
            return text
        
        # 移除HTML标签
        clean_text = re.sub(r'<[^>]*>', '', text)
        
        # 移除JavaScript事件
        clean_text = re.sub(r'on\w+\s*=\s*["\'][^"\']*["\']', '', clean_text, flags=re.IGNORECASE)
        
        # 移除javascript:协议
        clean_text = re.sub(r'javascript:', '', clean_text, flags=re.IGNORECASE)
        
        return clean_text.strip()
    
    @staticmethod
    def sanitize_sql(text):
        """防止SQL注入"""
        if not text:
            return text
        
        # 移除常见的SQL注入模式
        dangerous_patterns = [
            r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)',
            r'(--|#|/\*|\*/)',
            r'(\bOR\b.*=.*\bOR\b)',
            r'(\bAND\b.*=.*\bAND\b)',
            r'(\'.*\')',
            r'(;.*)',
        ]
        
        clean_text = text
        for pattern in dangerous_patterns:
            clean_text = re.sub(pattern, '', clean_text, flags=re.IGNORECASE)
        
        return clean_text.strip()
    
    @staticmethod
    def validate_email_format(email):
        """验证邮箱格式"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_phone_format(phone):
        """验证电话格式"""
        # 移除所有非数字字符
        clean_phone = re.sub(r'[^\d+]', '', phone)
        
        # 检查长度和格式
        if len(clean_phone) < 7 or len(clean_phone) > 15:
            return False
        
        return True
    
    @staticmethod
    def validate_url_format(url):
        """验证URL格式"""
        pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        return re.match(pattern, url) is not None

class SecurityLogger:
    """安全日志记录器"""
    
    @staticmethod
    def log_security_event(event_type, details, ip_address=None, user_id=None):
        """记录安全事件"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'details': details,
            'ip_address': ip_address or get_remote_address(),
            'user_id': user_id,
            'user_agent': request.headers.get('User-Agent', '')
        }
        
        logger.warning(f"Security Event: {log_entry}")
    
    @staticmethod
    def log_failed_login(email, ip_address):
        """记录登录失败"""
        SecurityLogger.log_security_event(
            'failed_login',
            f'Failed login attempt for {email}',
            ip_address
        )
    
    @staticmethod
    def log_suspicious_activity(activity, ip_address):
        """记录可疑活动"""
        SecurityLogger.log_security_event(
            'suspicious_activity',
            activity,
            ip_address
        )

def validate_request_data(required_fields=None, optional_fields=None):
    """请求数据验证装饰器"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({
                    'success': False,
                    'message': 'Request must be JSON'
                }), 400
            
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'No data provided'
                }), 400
            
            # 检查必需字段
            if required_fields:
                missing_fields = []
                for field in required_fields:
                    if field not in data or not data[field]:
                        missing_fields.append(field)
                
                if missing_fields:
                    return jsonify({
                        'success': False,
                        'message': f'Missing required fields: {", ".join(missing_fields)}'
                    }), 400
            
            # 清理输入数据
            cleaned_data = {}
            all_fields = (required_fields or []) + (optional_fields or [])
            
            for field in all_fields:
                if field in data:
                    value = data[field]
                    if isinstance(value, str):
                        cleaned_data[field] = InputSanitizer.sanitize_html(value)
                    else:
                        cleaned_data[field] = value
            
            # 将清理后的数据添加到请求上下文
            request.cleaned_data = cleaned_data
            
            return f(*args, **kwargs)
        
        return decorated_function
    
    return decorator

def check_rate_limit(limit="10 per minute"):
    """检查请求频率限制"""
    def decorator(f):
        @wraps(f)
        @limiter.limit(limit)
        def decorated_function(*args, **kwargs):
            return f(*args, **kwargs)
        
        return decorated_function
    
    return decorator

class CSRFProtection:
    """CSRF保护"""
    
    @staticmethod
    def generate_csrf_token():
        """生成CSRF令牌"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def validate_csrf_token(token, session_token):
        """验证CSRF令牌"""
        return secrets.compare_digest(token, session_token)

def require_csrf_token(f):
    """CSRF令牌验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        csrf_token = request.headers.get('X-CSRF-Token')
        session_token = request.headers.get('X-Session-Token')
        
        if not csrf_token or not session_token:
            return jsonify({
                'success': False,
                'message': 'CSRF token required'
            }), 403
        
        if not CSRFProtection.validate_csrf_token(csrf_token, session_token):
            SecurityLogger.log_security_event(
                'csrf_validation_failed',
                'Invalid CSRF token',
                get_remote_address()
            )
            return jsonify({
                'success': False,
                'message': 'Invalid CSRF token'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function

def detect_bot_traffic():
    """检测机器人流量"""
    user_agent = request.headers.get('User-Agent', '').lower()
    
    # 常见的机器人标识
    bot_patterns = [
        'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
        'python-requests', 'postman', 'insomnia'
    ]
    
    for pattern in bot_patterns:
        if pattern in user_agent:
            return True
    
    return False

def require_human_verification(f):
    """人机验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if detect_bot_traffic():
            SecurityLogger.log_suspicious_activity(
                'Bot traffic detected',
                get_remote_address()
            )
            return jsonify({
                'success': False,
                'message': 'Human verification required'
            }), 429
        
        return f(*args, **kwargs)
    
    return decorated_function

class IPWhitelist:
    """IP白名单管理"""
    
    def __init__(self):
        self.whitelist = set()
        self.blacklist = set()
    
    def add_to_whitelist(self, ip):
        """添加到白名单"""
        self.whitelist.add(ip)
    
    def add_to_blacklist(self, ip):
        """添加到黑名单"""
        self.blacklist.add(ip)
    
    def is_allowed(self, ip):
        """检查IP是否被允许"""
        if ip in self.blacklist:
            return False
        
        if self.whitelist and ip not in self.whitelist:
            return False
        
        return True

# 全局IP管理器
ip_manager = IPWhitelist()

def require_ip_whitelist(f):
    """IP白名单验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        client_ip = get_remote_address()
        
        if not ip_manager.is_allowed(client_ip):
            SecurityLogger.log_security_event(
                'ip_blocked',
                f'Access denied for IP: {client_ip}',
                client_ip
            )
            return jsonify({
                'success': False,
                'message': 'Access denied'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function

