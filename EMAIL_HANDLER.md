## 📧 任务2：邮件系统和后台管理 (高优先级)

### Claude Code Prompt:
```
我需要为机器人销售网站建立完整的邮件收集和管理系统，确保能够有效收集和管理销售线索。

当前后端情况：
- Express.js + Resend邮件服务
- 基础联系表单功能
- 简单的管理后台框架

商业需求：
- 即将投放广告，需要可靠的线索收集
- 需要实时收到客户询盘通知
- 需要管理和跟进销售线索
- 需要配置Namecheap邮件转发

完整功能要求：

1. **邮件收集系统**
   - 多种表单类型（询价、技术支持、合作咨询）
   - 表单数据验证和安全防护
   - 自动邮件回复系统
   - 邮件模板管理

2. **销售线索管理**
   - 线索自动分类和评分
   - 客户信息完整记录
   - 跟进状态管理
   - 导出功能（CSV/Excel）

3. **通知系统**
   - 实时新线索通知
   - 邮件/短信提醒
   - 管理员仪表板
   - 统计报告

4. **后台管理界面**
   - 线索列表和详情查看
   - 搜索和筛选功能
   - 批量操作
   - 数据分析图表

5. **邮件配置**
   - Namecheap邮件转发设置指南
   - SMTP配置优化
   - 邮件送达率优化
   - 反垃圾邮件设置

技术要求：
- 使用现有Express.js + Resend架构
- 添加SQLite数据库支持
- 创建React管理界面组件
- 实现邮件队列和重试机制
- 添加API安全验证

数据库设计：
```sql
-- 销售线索表
CREATE TABLE leads (
  id INTEGER PRIMARY KEY,
  company_name TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  inquiry_type TEXT,
  message TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
);

-- 跟进记录表
CREATE TABLE follow_ups (
  id INTEGER PRIMARY KEY,
  lead_id INTEGER,
  action TEXT,
  notes TEXT,
  created_at DATETIME,
  FOREIGN KEY (lead_id) REFERENCES leads (id)
);
```

请提供：
1. 完整的后端API实现
2. 数据库设计和模型
3. 前端管理界面组件
4. 邮件模板系统
5. Namecheap配置指南
6. 部署和测试说明

确保系统稳定可靠，能够处理大量询盘。
```