# CHIRAL Brand Processor

A professional Python-based system for converting DEEP Robotics PDF documents to CHIRAL branding for white-label sales operations.

## 🚀 Features

- **Intelligent Text Replacement**: Replace company names, contact information, and product names while preserving document formatting
- **Logo Generation & Replacement**: Automatically generate CHIRAL logos and replace existing branding elements
- **Batch Processing**: Process multiple PDF files simultaneously with progress tracking
- **Multi-language Support**: Handle both English and Chinese text with proper Unicode support
- **Quality Control**: Validate replacements and maintain document integrity
- **Preview Mode**: Preview changes before applying them
- **Professional Output**: Maintain high-quality PDF output suitable for commercial use

## 📋 Requirements

### System Dependencies

```bash
# macOS (using Homebrew)
brew install poppler tesseract

# Ubuntu/Debian
sudo apt-get install poppler-utils tesseract-ocr tesseract-ocr-chi-sim

# CentOS/RHEL
sudo yum install poppler-utils tesseract tesseract-langpack-chi-sim
```

### Python Dependencies

```bash
pip install -r requirements.txt
```

## 📁 Project Structure

```
chiral_brand_processor/
├── main.py                 # Main application entry point
├── pdf_processor.py        # PDF handling and manipulation
├── text_replacer.py        # Text replacement logic
├── logo_generator.py       # Logo generation and replacement
├── config.json            # Configuration file
├── requirements.txt        # Python dependencies
├── input/                 # Place original PDF files here
├── output/                # Processed files will be saved here
├── assets/                # Generated logos and resources
├── logs/                  # Processing logs and reports
└── README.md              # This file
```

## ⚙️ Configuration

The `config.json` file controls all processing behavior:

### Text Replacements
```json
{
  "text_replacements": {
    "DEEP Robotics": "CHIRAL",
    "云深处科技": "CHIRAL",
    "www.deeprobotics.cn": "www.chiralrobotics.com"
  }
}
```

### Logo Settings
```json
{
  "logo_settings": {
    "font_family": "Arial",
    "font_weight": "bold",
    "color": "#1e3a5f",
    "style": "modern"
  }
}
```

### Product Naming
```json
{
  "product_naming": {
    "remove_prefix": ["Jueying", "绝影"],
    "add_prefix": "Chiral",
    "model_names": ["Lite3", "X20", "Mini", "X30"]
  }
}
```

## 🖥️ Usage

### Command Line Interface

```bash
# Basic usage - process all PDFs in input folder
python main.py process

# Process specific file
python main.py single --file path/to/document.pdf

# Preview changes without applying them
python main.py preview --file path/to/document.pdf

# Custom input/output directories
python main.py process --input /path/to/input --output /path/to/output
```

### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `process` | Batch process all PDFs in input directory | `python main.py process` |
| `single` | Process a single PDF file | `python main.py single --file doc.pdf` |
| `preview` | Preview replacements without applying | `python main.py preview --file doc.pdf` |

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--input` | Input directory path | `input` |
| `--output` | Output directory path | `output` |
| `--config` | Configuration file path | `config.json` |
| `--verbose` | Enable detailed logging | `False` |

## 📝 Step-by-Step Guide

### 1. Installation

```bash
# Clone or download the project
git clone <repository-url>
cd chiral_brand_processor

# Install system dependencies (see Requirements section)

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Prepare Input Files

```bash
# Place PDF files in the input directory
cp JueyingLite3.pdf input/
cp JueyingX20.pdf input/
cp *.pdf input/
```

### 3. Configure Settings

Edit `config.json` to customize:
- Text replacement rules
- Logo appearance
- Output naming conventions
- Quality settings

### 4. Preview Changes (Optional)

```bash
# Preview replacements for a specific file
python main.py preview --file input/JueyingLite3.pdf
```

### 5. Process Files

```bash
# Process all files in input directory
python main.py process

# Or process a single file
python main.py single --file input/JueyingLite3.pdf
```

### 6. Review Output

- Check the `output/` directory for processed files
- Review the processing report in `logs/`
- Verify quality and completeness

## 🎯 Supported Input Files

The system is designed to handle the following DEEP Robotics product documents:

- **JueyingLite3.pdf** (2 pages) → `Chiral_Lite3_Datasheet.pdf`
- **JueyingLite2.pdf** → `Chiral_Lite2_Datasheet.pdf`
- **JueyingMini.pdf** (2 pages) → `Chiral_Mini_Datasheet.pdf`
- **JueyingX20.pdf** (2 pages) → `Chiral_X20_Datasheet.pdf`
- **X30.pdf** → `Chiral_X30_Datasheet.pdf`
- **J60Joint.pdf** → `Chiral_J60Joint_Datasheet.pdf`

## 🔧 Advanced Configuration

### Custom Logo Styles

```json
{
  "logo_settings": {
    "style": "modern",     // Options: modern, tech, minimal
    "variations": {
      "standard": {"color": "#1e3a5f", "background": "transparent"},
      "white_bg": {"color": "#1e3a5f", "background": "white"},
      "dark": {"color": "#ffffff", "background": "#2c3e50"}
    }
  }
}
```

### Quality Control

```json
{
  "quality_control": {
    "validate_urls": true,
    "validate_emails": true,
    "check_broken_links": true,
    "preserve_formatting": true,
    "verify_replacements": true
  }
}
```

### Output Customization

```json
{
  "output_naming": {
    "prefix": "Chiral_",
    "suffix": "_Datasheet",
    "preserve_original": false,
    "date_stamp": false
  }
}
```

## 📊 Processing Reports

After each run, detailed reports are generated in the `logs/` directory:

- **Processing Log**: Detailed operation log with timestamps
- **Summary Report**: Overview of successful/failed files
- **Replacement Statistics**: Count of text replacements made
- **Quality Check Results**: Validation results

## 🚨 Troubleshooting

### Common Issues

1. **"No PDF files found"**
   - Ensure PDF files are in the correct input directory
   - Check file permissions

2. **"Font loading failed"**
   - Install system fonts or use fallback fonts
   - Check font file paths in logs

3. **"Logo replacement failed"**
   - Verify logo generation succeeded
   - Check image file permissions

4. **"Text encoding issues"**
   - Ensure system supports UTF-8 encoding
   - Check Chinese language support

### System Dependencies

```bash
# Verify poppler installation
pdftoppm -h

# Verify tesseract installation
tesseract --version

# Check available tesseract languages
tesseract --list-langs
```

### Python Environment

```bash
# Verify Python version (3.8+ required)
python --version

# Check installed packages
pip list | grep -E "(PyMuPDF|Pillow|reportlab)"
```

## 🔒 Security & Privacy

- **No Network Access**: All processing is done locally
- **No Data Collection**: No user data is transmitted or stored remotely
- **Temporary Files**: Automatically cleaned up after processing
- **Input Preservation**: Original files are never modified (backup option available)

## 📈 Performance Notes

- **Processing Speed**: ~5-10 seconds per page depending on complexity
- **Memory Usage**: ~100-500MB per PDF depending on size
- **Disk Space**: Temporary files may require 2-3x original file size
- **Batch Processing**: Parallel processing not implemented (sequential processing)

## 🛠️ Development

### Running Tests

```bash
# Run test suite
python test_processor.py

# Run with coverage
pip install pytest-cov
pytest --cov=. tests/
```

### Code Quality

```bash
# Format code
black *.py

# Lint code
flake8 *.py
```

## 📄 License

This project is proprietary software for internal use by CHIRAL Robotics and authorized partners.

## 🆘 Support

For technical support or feature requests:

1. Check the troubleshooting section above
2. Review the logs in the `logs/` directory
3. Contact the development team with specific error messages

## 📋 Changelog

### Version 1.0.0
- Initial release
- Support for all major DEEP Robotics PDF formats
- Comprehensive text replacement engine
- Professional logo generation
- Batch processing capabilities
- Multi-language support (English/Chinese)
- Quality control and validation
- Detailed logging and reporting

---

**Note**: This tool is designed for white-label rebranding of DEEP Robotics products under the CHIRAL brand. Ensure you have proper authorization before using this tool for commercial purposes.