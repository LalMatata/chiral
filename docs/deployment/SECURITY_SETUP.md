# 🔒 安全配置指南

## 🚨 敏感信息保护

### 📋 需要保密的信息清单

#### 1. API 密钥和令牌
- `RESEND_API_KEY` - 邮件服务API密钥
- `JWT_SECRET` - JSON Web Token签名密钥
- `ADMIN_API_KEY` - 管理员API密钥
- `GA_MEASUREMENT_ID` - Google Analytics ID（可选）

#### 2. 部署平台密钥
- Vercel API Token
- GitHub Personal Access Token
- Manus Cloud Platform API Key

#### 3. 个人和公司信息
- 个人邮箱地址
- 真实公司邮箱
- 个人账户信息
- 域名管理凭据

#### 4. SEO 和分析工具配置
- Google Analytics ID
- Google Search Console 验证码
- Facebook Pixel ID
- 百度统计 ID
- 其他第三方分析工具 ID
- SEO 关键词策略配置

#### 4. 生产环境配置
- 数据库连接字符串
- SMTP服务器凭据
- SSL证书信息

### 🛡️ 本地安全存储

#### 1. 环境变量文件 (.env)
```bash
# 将此文件放在项目根目录，已在 .gitignore 中排除
# 复制 .env.example 并填入真实值

# 邮件配置
RESEND_API_KEY=re_your_real_api_key_here
FROM_EMAIL=noreply@your-domain.com
SALES_EMAIL=sales@your-domain.com

# 安全配置
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ADMIN_API_KEY=your-admin-api-key-change-in-production

# 分析和SEO工具配置（生产环境必填）
GA_MEASUREMENT_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
BAIDU_ANALYTICS_ID=your_baidu_analytics_id
GOOGLE_SITE_VERIFICATION=your_google_verification_code

# 服务器配置
PORT=3001
NODE_ENV=production
```

#### 2. 本地密钥存储文件
创建 `~/.chiral_secrets` 文件（在用户主目录）：
```bash
# Vercel部署密钥
export VERCEL_TOKEN=your_vercel_token_here

# GitHub API密钥（用于CI/CD）
export GITHUB_TOKEN=your_github_personal_access_token

# Manus Cloud平台密钥
export MANUS_API_KEY=your_manus_api_key

# 域名管理
export DOMAIN_API_KEY=your_domain_provider_api_key
```

### 🔐 .gitignore 配置验证

确保以下文件和模式已添加到 `.gitignore`：

```gitignore
# 环境变量和配置
.env
.env.*
!.env.example

# 密钥文件
*.key
*.pem
*.p12
secrets/
config/secrets.json

# 本地部署配置
.vercel
.netlify
.firebase

# 个人配置
.vscode/settings.json
.idea/workspace.xml

# 数据库文件（如果包含敏感数据）
data/
*.db
*.sqlite

# 日志文件（可能包含敏感信息）
logs/
*.log

# 备份文件
*.backup
*.bak
```

### 🚀 部署平台环境变量设置

#### Vercel 部署
1. 登录 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 添加以下环境变量：
   ```
   RESEND_API_KEY=your_resend_api_key
   JWT_SECRET=your_jwt_secret
   SALES_EMAIL=sales@chiralrobotics.com
   FROM_EMAIL=noreply@chiralrobotics.com
   NODE_ENV=production
   ```

#### Manus Cloud 部署
1. 在 Manus 项目设置中配置环境变量
2. 使用 Manus CLI 设置密钥：
   ```bash
   manus env set RESEND_API_KEY your_api_key
   manus env set JWT_SECRET your_jwt_secret
   ```

### 🛠️ 开发环境设置

#### 首次设置
1. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入真实值：
   ```bash
   nano .env
   ```

3. 验证 `.env` 文件不会被提交：
   ```bash
   git status
   # .env 应该不出现在待提交文件中
   ```

#### 团队协作
1. **永远不要**在聊天、邮件或文档中分享真实的API密钥
2. 使用占位符值如 `your_api_key_here`
3. 通过安全渠道（如加密聊天）单独分享密钥
4. 定期轮换敏感密钥

### ⚠️ 泄露应急响应

如果敏感信息意外提交到 Git：

#### 1. 立即行动
```bash
# 从历史记录中移除敏感文件
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all

# 强制推送清理后的历史
git push origin --force --all
```

#### 2. 立即更换密钥
- 撤销泄露的 API 密钥
- 生成新的密钥
- 更新所有部署环境

#### 3. 验证清理
```bash
# 检查文件不在历史记录中
git log --all --full-history -- .env
```

### 🔍 安全检查清单

- [ ] `.env` 文件已在 `.gitignore` 中
- [ ] 生产环境使用强密钥（至少32字符）
- [ ] API 密钥已在提供商处激活
- [ ] 所有文档中使用占位符而非真实密钥
- [ ] 部署平台环境变量已正确配置
- [ ] 团队成员了解安全流程
- [ ] 定期检查 git 历史记录无敏感信息

### 📞 紧急联系

如发现安全问题：
1. 立即停止相关服务
2. 通知团队负责人
3. 记录事件详情
4. 按照应急响应流程处理

---

**重要提醒：** 安全是持续过程，不是一次性设置。定期审查和更新安全配置。