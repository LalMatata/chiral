## 📄 任务3：产品资料品牌替换系统 (中优先级)

### Claude Code Prompt:
```
我需要创建一个自动化系统，将云深处(DEEP Robotics)的机器狗产品PDF资料替换为Chiral品牌，用于海外白牌销售。

输入文件（后续根据prompt提供）：
- JueyingLite3.pdf (2页)
- JueyingLite2.pdf 
- JueyingMini.pdf (2页)
- JueyingX20.pdf (2页)
- X30.pdf
- J60Joint.pdf

品牌替换规则：

原品牌 → 新品牌：
- "DEEP Robotics" → "CHIRAL"
- "云深处科技" → "CHIRAL"
- "DeepRobotics Co.,Ltd." → "Chiral Robotics"
- "杭州云深处科技有限公司" → "Chiral Robotics"

联系信息替换：
- www.deeprobotics.cn → www.chiralrobotics.com
- @deeprobotics.cn → @chiralrobotics.com
- 0571-85073796 → [待定]
- 中国地址 → [待定]

产品命名策略：
- 去除"Jueying"(绝影)品牌名
- 保持型号：Lite3, X20, Mini, X30等
- 新命名：Chiral Lite3, Chiral X20等

技术实现要求：

1. **PDF处理功能**
   - 文本检测和替换
   - 保持原有格式和布局
   - 处理中英文混合内容
   - 高质量PDF输出

2. **Logo替换**
   - 检测原有logo位置
   - 生成简洁的CHIRAL文字logo
   - 保持设计风格一致
   - 支持不同尺寸适配

3. **批量处理**
   - 自动处理所有PDF文件
   - 进度显示和错误处理
   - 生成处理报告
   - 质量检查功能

4. **用户界面**
   - 简单的命令行界面
   - 配置文件支持
   - 处理日志记录
   - 预览功能

实现代码结构：
```
/chiral_brand_processor/
├── main.py                 # 主程序
├── pdf_processor.py        # PDF处理模块
├── logo_generator.py       # Logo生成
├── text_replacer.py        # 文本替换
├── config.json            # 配置文件
├── input/                 # 原始PDF
├── output/                # 处理后PDF
├── assets/                # 资源文件
├── logs/                  # 处理日志
└── requirements.txt       # 依赖包
```

配置文件示例：
```json
{
  "text_replacements": {
    "DEEP Robotics": "CHIRAL",
    "云深处科技": "CHIRAL",
    "www.deeprobotics.cn": "chiralrobotics.com"
  },
  "logo_settings": {
    "font_family": "Arial",
    "font_weight": "bold",
    "color": "#1e3a5f",
    "size": "auto"
  },
  "output_naming": {
    "prefix": "Chiral_",
    "suffix": "_Datasheet"
  }
}
```

请提供：
1. 完整的Python实现代码
2. 依赖包列表
3. 使用说明文档
4. 测试和验证脚本
5. 错误处理和日志系统

确保处理后的PDF保持专业外观，适合商业使用。
```