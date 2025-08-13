import os
import sys
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate

# 导入配置
from src.config import config

# 导入模型
from src.models import db, Lead, DemoRequest, LeadActivity, ContactForm

# 导入路由
from src.routes.leads import leads_bp
from src.routes.user import user_bp

# 导入工具
from src.utils.email_service import init_mail
from src.utils.security import init_security, SecurityLogger, get_remote_address

def create_app(config_name=None):
    """应用工厂函数"""
    
    # 创建Flask应用
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # 加载配置
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # 配置CORS
    CORS(app, 
         origins=app.config.get('CORS_ORIGINS', ['*']),
         allow_headers=['Content-Type', 'Authorization', 'X-API-Key', 'X-CSRF-Token'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # 初始化扩展
    db.init_app(app)
    migrate = Migrate(app, db)
    init_mail(app)
    init_security(app)
    
    # 配置日志
    setup_logging(app)
    
    # 注册蓝图
    app.register_blueprint(leads_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    # 注册错误处理器
    register_error_handlers(app)
    
    # 注册请求钩子
    register_request_hooks(app)
    
    # 静态文件服务
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        """服务静态文件"""
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return jsonify({
                    'message': 'CHIRAL Backend API',
                    'version': '1.0.0',
                    'status': 'running',
                    'timestamp': datetime.utcnow().isoformat()
                })
    
    # API健康检查
    @app.route('/api/health')
    def health_check():
        """API健康检查"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'database': 'connected' if db.engine else 'disconnected'
        })
    
    # API信息
    @app.route('/api/info')
    def api_info():
        """API信息"""
        return jsonify({
            'name': 'CHIRAL Backend API',
            'version': '1.0.0',
            'description': 'Backend API for CHIRAL robotics website',
            'endpoints': {
                'leads': '/api/leads',
                'demo_requests': '/api/leads/{id}/demo',
                'contact': '/api/contact',
                'analytics': '/api/analytics/leads',
                'health': '/api/health'
            },
            'documentation': 'https://api.chiral-robotics.com/docs'
        })
    
    return app

def setup_logging(app):
    """设置日志"""
    if not app.debug and not app.testing:
        # 创建日志目录
        log_dir = os.path.dirname(app.config.get('LOG_FILE', 'logs/chiral-backend.log'))
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # 文件日志处理器
        file_handler = RotatingFileHandler(
            app.config.get('LOG_FILE', 'logs/chiral-backend.log'),
            maxBytes=10240000,  # 10MB
            backupCount=10
        )
        
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        
        file_handler.setLevel(getattr(logging, app.config.get('LOG_LEVEL', 'INFO')))
        app.logger.addHandler(file_handler)
        
        app.logger.setLevel(getattr(logging, app.config.get('LOG_LEVEL', 'INFO')))
        app.logger.info('CHIRAL Backend startup')

def register_error_handlers(app):
    """注册错误处理器"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'message': 'Bad request',
            'error_code': 400
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'success': False,
            'message': 'Unauthorized',
            'error_code': 401
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'success': False,
            'message': 'Forbidden',
            'error_code': 403
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Resource not found',
            'error_code': 404
        }), 404
    
    @app.errorhandler(429)
    def rate_limit_exceeded(error):
        return jsonify({
            'success': False,
            'message': 'Rate limit exceeded. Please try again later.',
            'error_code': 429
        }), 429
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f'Server Error: {error}')
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error_code': 500
        }), 500

def register_request_hooks(app):
    """注册请求钩子"""
    
    @app.before_request
    def before_request():
        """请求前处理"""
        # 记录API请求
        if request.path.startswith('/api/'):
            app.logger.info(f'{request.method} {request.path} from {get_remote_address()}')
        
        # 安全检查
        if request.path.startswith('/api/') and request.method == 'POST':
            # 检查Content-Type
            if not request.is_json:
                return jsonify({
                    'success': False,
                    'message': 'Content-Type must be application/json'
                }), 400
    
    @app.after_request
    def after_request(response):
        """请求后处理"""
        # 添加安全头
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # 记录响应状态
        if request.path.startswith('/api/') and response.status_code >= 400:
            app.logger.warning(f'{request.method} {request.path} returned {response.status_code}')
        
        return response

# 创建应用实例
app = create_app()

if __name__ == '__main__':
    # 开发环境运行
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.logger.info(f'Starting CHIRAL Backend on port {port}')
    app.run(host='0.0.0.0', port=port, debug=debug)

