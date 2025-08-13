import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Email Configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'noreply@chiral-robotics.com'
    
    # Notification Recipients
    SALES_EMAIL = os.environ.get('SALES_EMAIL') or 'sales@chiral-robotics.com'
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL') or 'admin@chiral-robotics.com'
    
    # CRM Integration
    HUBSPOT_ACCESS_TOKEN = os.environ.get('HUBSPOT_ACCESS_TOKEN')
    HUBSPOT_PORTAL_ID = os.environ.get('HUBSPOT_PORTAL_ID')
    
    # Salesforce Integration
    SALESFORCE_USERNAME = os.environ.get('SALESFORCE_USERNAME')
    SALESFORCE_PASSWORD = os.environ.get('SALESFORCE_PASSWORD')
    SALESFORCE_SECURITY_TOKEN = os.environ.get('SALESFORCE_SECURITY_TOKEN')
    SALESFORCE_DOMAIN = os.environ.get('SALESFORCE_DOMAIN')
    
    # Redis Configuration
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # Rate Limiting
    RATELIMIT_STORAGE_URL = os.environ.get('RATELIMIT_STORAGE_URL') or 'redis://localhost:6379/1'
    RATELIMIT_DEFAULT = "100 per hour"
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Lead Scoring Weights
    LEAD_SCORE_WEIGHTS = {
        'industry': int(os.environ.get('LEAD_SCORE_WEIGHTS_INDUSTRY', 10)),
        'company_size': int(os.environ.get('LEAD_SCORE_WEIGHTS_COMPANY_SIZE', 8)),
        'budget': int(os.environ.get('LEAD_SCORE_WEIGHTS_BUDGET', 10)),
        'timeline': int(os.environ.get('LEAD_SCORE_WEIGHTS_TIMELINE', 6)),
    }
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    
    # Session Configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'logs/chiral-backend.log')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # Enhanced security for production
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

