# CHIRAL Backend 部署指南

本指南详细说明如何在生产环境中部署CHIRAL Backend API系统。

## 🎯 部署架构

```
Internet
    ↓
[Nginx Load Balancer]
    ↓
[Flask App Instances] ← → [Redis Cache]
    ↓
[PostgreSQL Database]
    ↓
[CRM Systems (HubSpot/Salesforce)]
```

## 🖥️ 服务器要求

### 最低配置
- **CPU**: 2核心
- **内存**: 4GB RAM
- **存储**: 20GB SSD
- **网络**: 100Mbps
- **操作系统**: Ubuntu 20.04 LTS

### 推荐配置
- **CPU**: 4核心
- **内存**: 8GB RAM
- **存储**: 50GB SSD
- **网络**: 1Gbps
- **操作系统**: Ubuntu 22.04 LTS

## 🚀 部署方式

### 方式一：Docker Compose (推荐)

#### 1. 准备服务器
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 添加用户到docker组
sudo usermod -aG docker $USER
```

#### 2. 部署应用
```bash
# 克隆代码
git clone <repository-url>
cd chiral-backend

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps
docker-compose logs -f web
```

#### 3. 初始化数据库
```bash
# 进入容器
docker-compose exec web bash

# 运行数据库迁移
flask db upgrade

# 创建管理员用户（可选）
python scripts/create_admin.py
```

### 方式二：传统部署

#### 1. 安装系统依赖
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Python和依赖
sudo apt install -y python3.11 python3.11-venv python3.11-dev
sudo apt install -y postgresql postgresql-contrib
sudo apt install -y redis-server
sudo apt install -y nginx
sudo apt install -y supervisor
```

#### 2. 配置数据库
```bash
# 启动PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql
```

```sql
CREATE DATABASE chiral_db;
CREATE USER chiral_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE chiral_db TO chiral_user;
\q
```

#### 3. 部署应用
```bash
# 创建应用目录
sudo mkdir -p /opt/chiral-backend
sudo chown $USER:$USER /opt/chiral-backend

# 克隆代码
cd /opt/chiral-backend
git clone <repository-url> .

# 创建虚拟环境
python3.11 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 初始化数据库
flask db upgrade
```

#### 4. 配置Supervisor
```bash
sudo nano /etc/supervisor/conf.d/chiral-backend.conf
```

```ini
[program:chiral-backend]
command=/opt/chiral-backend/venv/bin/gunicorn --bind 127.0.0.1:5000 --workers 4 src.main:app
directory=/opt/chiral-backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/chiral-backend.log
```

```bash
# 重新加载配置
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start chiral-backend
```

#### 5. 配置Nginx
```bash
sudo nano /etc/nginx/sites-available/chiral-backend
```

```nginx
server {
    listen 80;
    server_name api.chiral-robotics.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/chiral-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 SSL证书配置

### 使用Let's Encrypt
```bash
# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d api.chiral-robotics.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 使用自定义证书
```bash
# 创建SSL目录
sudo mkdir -p /etc/nginx/ssl

# 复制证书文件
sudo cp your-cert.pem /etc/nginx/ssl/cert.pem
sudo cp your-key.pem /etc/nginx/ssl/key.pem

# 设置权限
sudo chmod 600 /etc/nginx/ssl/*
```

## 📧 邮件服务配置

### Gmail配置
```bash
# 在.env文件中配置
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # 使用应用专用密码
```

### 自定义SMTP
```bash
MAIL_SERVER=your-smtp-server.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
```

## 🔗 CRM集成配置

### HubSpot集成
1. 登录HubSpot开发者账户
2. 创建私有应用
3. 获取访问令牌
4. 配置环境变量：
```bash
HUBSPOT_ACCESS_TOKEN=your-access-token
HUBSPOT_PORTAL_ID=your-portal-id
```

### Salesforce集成
1. 创建Salesforce连接应用
2. 获取客户端ID和密钥
3. 配置环境变量：
```bash
SALESFORCE_USERNAME=your-username
SALESFORCE_PASSWORD=your-password
SALESFORCE_SECURITY_TOKEN=your-token
SALESFORCE_DOMAIN=login  # 或 test
```

## 📊 监控和日志

### 日志配置
```bash
# 创建日志目录
sudo mkdir -p /var/log/chiral-backend
sudo chown www-data:www-data /var/log/chiral-backend

# 配置日志轮转
sudo nano /etc/logrotate.d/chiral-backend
```

```
/var/log/chiral-backend/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 监控脚本
```bash
# 创建健康检查脚本
sudo nano /usr/local/bin/chiral-health-check.sh
```

```bash
#!/bin/bash
HEALTH_URL="http://localhost:5000/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Service is healthy"
else
    echo "$(date): Service is unhealthy (HTTP $RESPONSE)"
    # 可以添加重启逻辑或发送告警
fi
```

```bash
# 设置执行权限
sudo chmod +x /usr/local/bin/chiral-health-check.sh

# 添加到crontab
sudo crontab -e
# 添加: */5 * * * * /usr/local/bin/chiral-health-check.sh >> /var/log/health-check.log
```

## 🔧 性能优化

### 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_lead_score ON leads(lead_score);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);

-- 配置PostgreSQL
-- 编辑 /etc/postgresql/14/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### Redis配置
```bash
# 编辑 /etc/redis/redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Nginx优化
```nginx
# 在nginx.conf中添加
worker_processes auto;
worker_connections 1024;

# 启用gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# 缓存配置
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔄 备份策略

### 数据库备份
```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-database.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="chiral_db"
DB_USER="chiral_user"

mkdir -p $BACKUP_DIR

# 创建数据库备份
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/chiral_db_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/chiral_db_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "chiral_db_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: chiral_db_$DATE.sql.gz"
```

```bash
# 设置执行权限
sudo chmod +x /usr/local/bin/backup-database.sh

# 添加到crontab（每天凌晨2点备份）
sudo crontab -e
# 添加: 0 2 * * * /usr/local/bin/backup-database.sh
```

### 应用备份
```bash
# 备份应用代码和配置
tar -czf /opt/backups/chiral-backend-$(date +%Y%m%d).tar.gz \
    /opt/chiral-backend \
    /etc/nginx/sites-available/chiral-backend \
    /etc/supervisor/conf.d/chiral-backend.conf
```

## 🚨 故障排除

### 常见问题

#### 1. 应用无法启动
```bash
# 检查日志
docker-compose logs web
# 或
sudo tail -f /var/log/chiral-backend.log

# 检查端口占用
sudo netstat -tlnp | grep :5000

# 检查权限
ls -la /opt/chiral-backend
```

#### 2. 数据库连接失败
```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 测试连接
psql -h localhost -U chiral_user -d chiral_db

# 检查防火墙
sudo ufw status
```

#### 3. 邮件发送失败
```bash
# 检查邮件配置
echo $MAIL_SERVER
echo $MAIL_USERNAME

# 测试SMTP连接
telnet smtp.gmail.com 587
```

#### 4. CRM同步失败
```bash
# 检查API令牌
curl -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
     https://api.hubapi.com/crm/v3/objects/contacts?limit=1

# 检查网络连接
ping api.hubapi.com
```

### 性能问题诊断
```bash
# 检查系统资源
top
htop
free -h
df -h

# 检查数据库性能
sudo -u postgres psql -d chiral_db -c "SELECT * FROM pg_stat_activity;"

# 检查Redis状态
redis-cli info memory
redis-cli info stats
```

## 📈 扩展部署

### 负载均衡
```nginx
upstream chiral_backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    listen 80;
    server_name api.chiral-robotics.com;
    
    location / {
        proxy_pass http://chiral_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 数据库读写分离
```python
# 在config.py中配置
class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_BINDS = {
        'read': os.environ.get('DATABASE_READ_URL')
    }
```

### 容器编排 (Kubernetes)
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chiral-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chiral-backend
  template:
    metadata:
      labels:
        app: chiral-backend
    spec:
      containers:
      - name: chiral-backend
        image: chiral-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: chiral-secrets
              key: database-url
```

## 🔐 安全加固

### 防火墙配置
```bash
# 配置UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 系统安全
```bash
# 禁用root登录
sudo nano /etc/ssh/sshd_config
# 设置: PermitRootLogin no

# 配置fail2ban
sudo apt install fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
```

### 应用安全
```bash
# 设置环境变量权限
chmod 600 .env

# 配置API密钥
openssl rand -hex 32  # 生成随机密钥

# 启用HTTPS重定向
# 在Nginx配置中添加
return 301 https://$server_name$request_uri;
```

---

这个部署指南涵盖了从基础部署到高级配置的所有方面，确保CHIRAL Backend能够在生产环境中稳定、安全、高效地运行。

