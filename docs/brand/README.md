# 📄 产品品牌资料文件夹

## 🚨 重要说明

此文件夹包含专有产品文档和品牌资料，**不上传到 GitHub 公共仓库**。

### 📁 本地文件结构（仅限本地存储）

```
docs/brand/
├── PDF files/           # 产品PDF文档（版权保护）
│   ├── X30.pdf         # X30系列技术规格
│   ├── X20.pdf         # X20系列技术规格  
│   ├── Lite3.pdf       # Lite3系列技术规格
│   └── ...             # 其他产品文档
├── CHIRAL_Product_Database.md     # 产品数据库
├── CHIRAL_Product_Summary.md      # 产品摘要
└── PRODUCT_DOC.md                 # 产品文档
```

### 🔒 版权保护

- **PDF文档**: 来源于第三方，受版权保护
- **产品资料**: 包含专有技术信息
- **品牌内容**: 仅供内部使用

### 💻 开发者指南

1. **产品信息**: 网站中的产品数据已集成到 `src/contexts/LanguageContext.jsx`
2. **图片资源**: 产品图片存储在 `src/assets/images/products/`
3. **内容更新**: 修改 LanguageContext 而非原始PDF文档

### 🚀 部署注意事项

部署到生产环境时，确保：
- PDF文档不包含在构建产物中
- 只使用已转换的文本内容
- 遵守版权法律要求

---

**提醒**: 这些文件保存在本地，不会同步到 Git 仓库或部署平台。