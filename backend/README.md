# CHIRAL Backend API

完整的Python Flask后端系统，用于处理CHIRAL网站的表单数据、数据库操作、CRM集成和邮件通知功能。

## 🚀 功能特性

### 核心功能
- **线索管理** - 完整的潜在客户信息管理系统
- **演示请求** - 产品演示预约和管理
- **联系表单** - 网站联系表单处理
- **邮件通知** - 自动化邮件通知系统
- **CRM集成** - HubSpot和Salesforce集成
- **数据分析** - 线索分析和报告

### 技术特性
- **RESTful API** - 标准化API接口
- **数据验证** - 全面的输入验证和清理
- **安全防护** - 多层安全防护机制
- **限流保护** - API请求频率限制
- **日志记录** - 完整的操作日志
- **错误处理** - 优雅的错误处理机制

## 📋 技术栈

- **框架**: Flask 3.1.1
- **数据库**: SQLAlchemy + PostgreSQL/SQLite
- **缓存**: Redis
- **邮件**: Flask-Mail
- **验证**: Marshmallow
- **安全**: JWT, CORS, 限流
- **部署**: Docker + Nginx + Gunicorn

## 🛠️ 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd chiral-backend
```

2. **创建虚拟环境**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\\Scripts\\activate  # Windows
```

3. **安装依赖**
```bash
pip install -r requirements.txt
```

4. **配置环境变量**
```bash
cp .env.example .env
# 编辑.env文件，填入实际配置
```

5. **初始化数据库**
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

6. **启动开发服务器**
```bash
python src/main.py
```

服务器将在 `http://localhost:5000` 启动

### Docker部署

1. **构建镜像**
```bash
docker build -t chiral-backend .
```

2. **使用Docker Compose**
```bash
# 复制环境变量文件
cp .env.example .env

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f web
```

## 📚 API文档

### 基础信息
- **Base URL**: `http://localhost:5000/api`
- **认证**: API Key 或 JWT Token
- **格式**: JSON

### 主要端点

#### 线索管理
```http
POST /api/leads
GET /api/leads
GET /api/leads/{id}
PUT /api/leads/{id}
```

#### 演示请求
```http
POST /api/leads/{id}/demo
```

#### 联系表单
```http
POST /api/contact
```

#### 分析数据
```http
GET /api/analytics/leads
```

#### 健康检查
```http
GET /api/health
```

### 请求示例

#### 创建线索
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "张",
    "last_name": "三",
    "email": "zhang.san@example.com",
    "phone": "+86-138-0013-8000",
    "company": "示例科技有限公司",
    "job_title": "技术总监",
    "industry": "manufacturing",
    "company_size": "large",
    "application_area": "inspection",
    "project_timeline": "short_term",
    "budget_range": "500k_1m",
    "requirements": "需要自动化巡检解决方案"
  }'
```

#### 创建演示请求
```bash
curl -X POST http://localhost:5000/api/leads/1/demo \
  -H "Content-Type: application/json" \
  -d '{
    "demo_type": "virtual",
    "preferred_date": "2024-02-15T14:00:00",
    "attendees_count": 5,
    "interested_products": "x30,x20",
    "special_requirements": "需要中文演示"
  }'
```

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `FLASK_ENV` | 运行环境 | `development` |
| `SECRET_KEY` | 应用密钥 | - |
| `DATABASE_URL` | 数据库连接 | SQLite |
| `MAIL_SERVER` | 邮件服务器 | `smtp.gmail.com` |
| `MAIL_USERNAME` | 邮件用户名 | - |
| `MAIL_PASSWORD` | 邮件密码 | - |
| `HUBSPOT_ACCESS_TOKEN` | HubSpot访问令牌 | - |
| `REDIS_URL` | Redis连接 | `redis://localhost:6379/0` |

### 数据库配置

支持多种数据库：
- **开发环境**: SQLite
- **生产环境**: PostgreSQL (推荐)
- **测试环境**: 内存SQLite

### 邮件配置

支持多种邮件服务：
- Gmail (推荐)
- Outlook
- 自定义SMTP服务器

### CRM集成

目前支持：
- **HubSpot** - 完整集成
- **Salesforce** - 基础集成

## 🔒 安全特性

### 数据验证
- 输入数据清理和验证
- SQL注入防护
- XSS攻击防护
- CSRF保护

### 访问控制
- API密钥认证
- JWT令牌认证
- IP白名单/黑名单
- 请求频率限制

### 安全头
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security

## 📊 监控和日志

### 日志级别
- **DEBUG** - 调试信息
- **INFO** - 一般信息
- **WARNING** - 警告信息
- **ERROR** - 错误信息

### 监控指标
- API请求统计
- 响应时间监控
- 错误率统计
- 数据库性能

## 🚀 部署指南

### 生产环境部署

1. **服务器要求**
   - CPU: 2核心以上
   - 内存: 4GB以上
   - 存储: 20GB以上
   - 操作系统: Ubuntu 20.04+

2. **域名和SSL**
   - 配置域名解析
   - 申请SSL证书
   - 配置Nginx反向代理

3. **数据库设置**
   - 安装PostgreSQL
   - 创建数据库和用户
   - 配置连接参数

4. **环境配置**
   - 设置生产环境变量
   - 配置邮件服务
   - 设置CRM集成

### 性能优化

1. **数据库优化**
   - 添加适当索引
   - 配置连接池
   - 定期维护

2. **缓存策略**
   - Redis缓存
   - 查询结果缓存
   - 静态文件缓存

3. **负载均衡**
   - 多实例部署
   - Nginx负载均衡
   - 数据库读写分离

## 🧪 测试

### 运行测试
```bash
# 单元测试
python -m pytest tests/

# 覆盖率测试
python -m pytest --cov=src tests/

# API测试
python -m pytest tests/test_api.py
```

### 测试数据
```bash
# 创建测试数据
python scripts/create_test_data.py

# 清理测试数据
python scripts/cleanup_test_data.py
```

## 📈 性能基准

### API响应时间
- 创建线索: < 200ms
- 查询线索: < 100ms
- 发送邮件: < 500ms
- CRM同步: < 1000ms

### 并发处理
- 支持并发: 100+ 请求/秒
- 数据库连接: 20个连接池
- 内存使用: < 512MB

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

### 代码规范
- 遵循PEP 8
- 添加类型注解
- 编写单元测试
- 更新文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

- **文档**: [API文档](https://api.chiral-robotics.com/docs)
- **问题**: [GitHub Issues](https://github.com/chiral/backend/issues)
- **邮件**: support@chiral-robotics.com

## 🔄 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 完整的线索管理系统
- CRM集成功能
- 邮件通知系统
- 安全防护机制

---

**CHIRAL Backend API** - 为CHIRAL机器人网站提供强大的后端支持

