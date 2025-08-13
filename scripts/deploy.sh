#!/bin/bash

# CHIRAL网站生产环境部署脚本
# 使用方法: ./scripts/deploy.sh [environment]

set -e

# 配置变量
ENVIRONMENT=${1:-production}
PROJECT_DIR="/opt/chiral-website"
BACKUP_DIR="/opt/backups"
LOG_FILE="/var/log/chiral-deploy.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# 检查权限
check_permissions() {
    log "检查部署权限..."
    if [[ $EUID -ne 0 ]]; then
        error "此脚本需要root权限运行"
    fi
}

# 检查依赖
check_dependencies() {
    log "检查系统依赖..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        error "Docker未安装，请先安装Docker"
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose未安装，请先安装Docker Compose"
    fi
    
    # 检查Git
    if ! command -v git &> /dev/null; then
        error "Git未安装，请先安装Git"
    fi
    
    log "系统依赖检查完成"
}

# 创建备份
create_backup() {
    log "创建系统备份..."
    
    mkdir -p $BACKUP_DIR
    BACKUP_NAME="chiral-backup-$(date +%Y%m%d-%H%M%S)"
    
    # 备份数据库
    if docker ps | grep -q postgres; then
        log "备份数据库..."
        docker exec chiral-postgres pg_dump -U chiral_user chiral_db > "$BACKUP_DIR/$BACKUP_NAME-database.sql"
    fi
    
    # 备份应用文件
    if [ -d "$PROJECT_DIR" ]; then
        log "备份应用文件..."
        tar -czf "$BACKUP_DIR/$BACKUP_NAME-files.tar.gz" -C "$PROJECT_DIR" .
    fi
    
    log "备份完成: $BACKUP_NAME"
}

# 更新代码
update_code() {
    log "更新应用代码..."
    
    if [ ! -d "$PROJECT_DIR" ]; then
        log "克隆代码仓库..."
        git clone https://github.com/LalMatata/chiral.git $PROJECT_DIR
    else
        log "更新代码仓库..."
        cd $PROJECT_DIR
        git fetch origin
        git checkout production-ready-implementation
        git pull origin production-ready-implementation
    fi
    
    cd $PROJECT_DIR
    log "当前代码版本: $(git rev-parse --short HEAD)"
}

# 构建应用
build_application() {
    log "构建应用..."
    
    cd $PROJECT_DIR
    
    # 构建前端
    log "构建前端应用..."
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    npm run build
    
    # 构建Docker镜像
    log "构建Docker镜像..."
    docker-compose -f docker-compose.production.yml build --no-cache
    
    log "应用构建完成"
}

# 配置环境
setup_environment() {
    log "配置生产环境..."
    
    cd $PROJECT_DIR
    
    # 检查环境变量文件
    if [ ! -f ".env.production" ]; then
        warn "未找到.env.production文件，请根据.env.production.example创建"
        cp .env.production.example .env.production
        error "请编辑.env.production文件并重新运行部署脚本"
    fi
    
    # 设置文件权限
    chmod 600 .env.production
    chown root:root .env.production
    
    # 创建必要目录
    mkdir -p nginx/logs postgres/backups redis/data
    
    log "环境配置完成"
}

# 部署服务
deploy_services() {
    log "部署服务..."
    
    cd $PROJECT_DIR
    
    # 停止现有服务
    log "停止现有服务..."
    docker-compose -f docker-compose.production.yml down --remove-orphans
    
    # 启动新服务
    log "启动新服务..."
    docker-compose -f docker-compose.production.yml up -d
    
    # 等待服务启动
    log "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    check_services
    
    log "服务部署完成"
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    
    cd $PROJECT_DIR
    
    # 检查容器状态
    if ! docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
        error "服务启动失败，请检查日志"
    fi
    
    # 检查健康状态
    sleep 10
    if ! curl -f http://localhost/health &> /dev/null; then
        warn "健康检查失败，请检查服务状态"
    fi
    
    log "服务状态检查完成"
}

# 数据库迁移
migrate_database() {
    log "执行数据库迁移..."
    
    cd $PROJECT_DIR
    
    # 等待数据库启动
    sleep 20
    
    # 执行迁移
    docker-compose -f docker-compose.production.yml exec -T backend flask db upgrade
    
    log "数据库迁移完成"
}

# 配置SSL证书
setup_ssl() {
    log "配置SSL证书..."
    
    cd $PROJECT_DIR
    
    # 检查证书文件
    if [ ! -f "nginx/ssl/fullchain.pem" ] || [ ! -f "nginx/ssl/privkey.pem" ]; then
        warn "SSL证书文件不存在，请手动配置证书"
        log "证书文件路径:"
        log "  - nginx/ssl/fullchain.pem"
        log "  - nginx/ssl/privkey.pem"
    else
        log "SSL证书配置完成"
    fi
}

# 配置防火墙
setup_firewall() {
    log "配置防火墙..."
    
    # 启用UFW
    ufw --force enable
    
    # 基础规则
    ufw default deny incoming
    ufw default allow outgoing
    
    # 允许SSH
    ufw allow ssh
    
    # 允许HTTP/HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # 重新加载规则
    ufw reload
    
    log "防火墙配置完成"
}

# 设置监控
setup_monitoring() {
    log "设置监控..."
    
    cd $PROJECT_DIR
    
    # 创建监控脚本
    cat > /usr/local/bin/chiral-monitor.sh << 'EOF'
#!/bin/bash
HEALTH_URL="http://localhost/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Service is healthy"
else
    echo "$(date): Service is unhealthy (HTTP $RESPONSE)"
    # 重启服务
    cd /opt/chiral-website
    docker-compose -f docker-compose.production.yml restart
fi
EOF
    
    chmod +x /usr/local/bin/chiral-monitor.sh
    
    # 添加到crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/chiral-monitor.sh >> /var/log/chiral-monitor.log") | crontab -
    
    log "监控设置完成"
}

# 清理旧文件
cleanup() {
    log "清理旧文件..."
    
    # 清理Docker镜像
    docker image prune -f
    
    # 清理旧备份（保留30天）
    find $BACKUP_DIR -name "chiral-backup-*" -mtime +30 -delete
    
    log "清理完成"
}

# 显示部署信息
show_deployment_info() {
    log "部署完成！"
    echo ""
    echo "=== 部署信息 ==="
    echo "环境: $ENVIRONMENT"
    echo "项目目录: $PROJECT_DIR"
    echo "代码版本: $(cd $PROJECT_DIR && git rev-parse --short HEAD)"
    echo "部署时间: $(date)"
    echo ""
    echo "=== 服务状态 ==="
    cd $PROJECT_DIR
    docker-compose -f docker-compose.production.yml ps
    echo ""
    echo "=== 访问地址 ==="
    echo "网站: https://chiral-robotics.com"
    echo "API: https://api.chiral-robotics.com"
    echo "健康检查: http://localhost/health"
    echo ""
    echo "=== 日志查看 ==="
    echo "应用日志: docker-compose -f docker-compose.production.yml logs -f"
    echo "Nginx日志: tail -f nginx/logs/access.log"
    echo "部署日志: tail -f $LOG_FILE"
}

# 主函数
main() {
    log "开始部署CHIRAL网站 ($ENVIRONMENT环境)"
    
    check_permissions
    check_dependencies
    create_backup
    update_code
    setup_environment
    build_application
    deploy_services
    migrate_database
    setup_ssl
    setup_firewall
    setup_monitoring
    cleanup
    show_deployment_info
    
    log "部署完成！"
}

# 错误处理
trap 'error "部署过程中发生错误，请检查日志: $LOG_FILE"' ERR

# 执行主函数
main "$@"

