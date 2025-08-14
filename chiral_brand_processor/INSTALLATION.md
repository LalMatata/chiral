# CHIRAL Brand Processor - Installation Guide

## Quick Start

### Option 1: Automatic Installation (Recommended)

```bash
# Navigate to the project directory
cd chiral_brand_processor

# Run the automatic setup script
python setup.py
```

The setup script will:
- ✅ Check Python version compatibility
- ✅ Install system dependencies (poppler, tesseract)
- ✅ Install Python packages
- ✅ Create necessary directories
- ✅ Run tests to verify installation
- ✅ Create sample files for testing

### Option 2: Manual Installation

#### 1. System Dependencies

**macOS (using Homebrew):**
```bash
brew install poppler tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install poppler-utils tesseract-ocr tesseract-ocr-chi-sim
```

**CentOS/RHEL:**
```bash
sudo yum install poppler-utils tesseract tesseract-langpack-chi-sim
```

**Windows:**
1. Download and install Poppler: https://blog.alivate.com.au/poppler-windows/
2. Download and install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki

#### 2. Python Dependencies

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

#### 3. Create Directories

```bash
mkdir -p input output assets logs
```

## System Requirements

### Python Version
- **Required**: Python 3.8 or higher
- **Recommended**: Python 3.9+ for best performance

### Operating System
- ✅ macOS 10.15+
- ✅ Ubuntu 18.04+
- ✅ CentOS 7+
- ✅ Windows 10+ (with manual setup)

### Hardware Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: 1GB free space for dependencies and processing
- **CPU**: Any modern CPU (multi-core recommended for batch processing)

## Verification

### Test Installation
```bash
# Run the test suite
python test_processor.py

# Run example usage
python example_usage.py
```

### Manual Verification
```bash
# Check system dependencies
pdftoppm -h
tesseract --version

# Check Python imports
python -c "import fitz, PIL, pdfplumber, reportlab; print('All imports successful')"
```

## Troubleshooting

### Common Issues

#### "ModuleNotFoundError: No module named 'fitz'"
**Solution:**
```bash
pip install PyMuPDF
```

#### "Command 'pdftoppm' not found"
**Solution:**
- **macOS**: `brew install poppler`
- **Ubuntu**: `sudo apt-get install poppler-utils`

#### "Command 'tesseract' not found"
**Solution:**
- **macOS**: `brew install tesseract`
- **Ubuntu**: `sudo apt-get install tesseract-ocr`

#### "Permission denied" errors
**Solution:**
```bash
chmod +x *.py
sudo chown -R $USER:$USER .
```

#### Font loading errors
**Solution:**
The system will fall back to default fonts if custom fonts aren't available.

### Getting Help

1. **Check Logs**: Look in the `logs/` directory for detailed error information
2. **Run Tests**: Use `python test_processor.py` to identify specific issues
3. **Verify Dependencies**: Ensure all system and Python dependencies are installed
4. **Check Permissions**: Ensure you have read/write permissions for all directories

## Performance Optimization

### For Large Batches
- Use SSD storage for better I/O performance
- Increase available RAM
- Process files in smaller batches if memory is limited

### For High-Quality Output
- Ensure sufficient disk space (3x original file size)
- Use `"quality": "high"` in configuration
- Set `"dpi": 300` for print-quality output

## Security Notes

- All processing is done locally - no data is sent to external servers
- Original files are never modified (unless backup is disabled)
- Temporary files are automatically cleaned up
- No network access required during normal operation

## Docker Installation (Advanced)

If you prefer to run in a containerized environment:

```bash
# Create Dockerfile (example)
FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-chi-sim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN chmod +x *.py

CMD ["python", "main.py", "process"]
```

```bash
# Build and run
docker build -t chiral-processor .
docker run -v /path/to/pdfs:/app/input -v /path/to/output:/app/output chiral-processor
```

---

Need help? Check the README.md for usage instructions and examples.