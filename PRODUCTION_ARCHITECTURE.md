# CHIRAL生产级架构文档

## 项目概述

本项目是CHIRAL四足机器人公司的官方网站，采用现代化的全栈架构，支持双语（英语/希伯来语）展示，具备完整的线索管理、CRM集成和营销自动化功能。

## 技术架构

### 前端架构
- **框架**: React 18 + Vite
- **样式**: Tailwind CSS + Shadcn/UI
- **路由**: React Router DOM
- **状态管理**: React Context + Hooks
- **国际化**: 自定义双语系统
- **SEO优化**: Meta标签 + 结构化数据

### 后端架构
- **框架**: Python Flask 3.1.1
- **数据库**: PostgreSQL + SQLAlchemy ORM
- **缓存**: Redis
- **任务队列**: Celery
- **API设计**: RESTful API
- **认证**: JWT + API Key

### 部署架构
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **SSL**: Let's Encrypt
- **监控**: 健康检查 + 日志聚合
- **备份**: 自动化数据库备份

## 项目结构

```
chiral-website-app/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   ├── contexts/          # 上下文管理
│   └── pages/             # 页面组件
├── backend/               # 后端源码
│   ├── src/               # Flask应用
│   ├── requirements.txt   # Python依赖
│   └── Dockerfile        # 后端容器配置
├── public/               # 静态资源
├── dist/                 # 构建输出
└── docker-compose.yml    # 容器编排
```

## 核心功能

### 1. 双语网站系统
- 英语/希伯来语动态切换
- RTL布局支持
- 本地化内容管理

### 2. 产品展示系统
- X30/X20/Lite3产品线
- 详细技术规格
- 应用场景展示

### 3. 线索管理系统
- 智能表单收集
- 线索评分算法
- CRM自动同步

### 4. 营销自动化
- 邮件通知系统
- 演示预约管理
- 客户跟进流程

## 安全特性

- HTTPS强制加密
- CORS跨域保护
- SQL注入防护
- XSS攻击防护
- API限流保护
- 数据加密存储

## 性能优化

- 代码分割加载
- 图片懒加载
- CDN内容分发
- 数据库索引优化
- Redis缓存加速
- Gzip压缩传输

## 监控与运维

- 健康检查端点
- 应用性能监控
- 错误日志追踪
- 自动化备份
- 告警通知机制

## 扩展性设计

- 微服务架构
- 水平扩展支持
- 负载均衡配置
- 数据库分片准备
- 多地区部署支持

