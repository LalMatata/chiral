#!/usr/bin/env python3
"""
Setup script for CHIRAL Brand Processor
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    
    print(f"✅ Python version: {sys.version}")
    return True

def install_system_dependencies():
    """Install system dependencies based on platform"""
    system = platform.system().lower()
    
    print(f"🔧 Installing system dependencies for {system}...")
    
    if system == "darwin":  # macOS
        print("Installing dependencies via Homebrew...")
        try:
            subprocess.run(["brew", "install", "poppler", "tesseract"], check=True)
            print("✅ System dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install via Homebrew. Please install manually:")
            print("   brew install poppler tesseract")
            return False
        except FileNotFoundError:
            print("❌ Homebrew not found. Please install:")
            print("   /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"")
            print("   Then run: brew install poppler tesseract")
            return False
    
    elif system == "linux":
        print("Installing dependencies via apt (Ubuntu/Debian)...")
        try:
            subprocess.run([
                "sudo", "apt-get", "update"
            ], check=True)
            subprocess.run([
                "sudo", "apt-get", "install", "-y", 
                "poppler-utils", "tesseract-ocr", "tesseract-ocr-chi-sim"
            ], check=True)
            print("✅ System dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install via apt. Please install manually:")
            print("   sudo apt-get install poppler-utils tesseract-ocr tesseract-ocr-chi-sim")
            return False
    
    elif system == "windows":
        print("❌ Windows automatic installation not supported")
        print("Please install manually:")
        print("1. Install poppler: https://blog.alivate.com.au/poppler-windows/")
        print("2. Install tesseract: https://github.com/UB-Mannheim/tesseract/wiki")
        return False
    
    else:
        print(f"❌ Unsupported system: {system}")
        return False

def install_python_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "--upgrade", "pip"
        ], check=True)
        
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], check=True)
        
        print("✅ Python dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Python dependencies: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    
    directories = [
        "input",
        "output", 
        "assets",
        "logs"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"   Created: {directory}/")
    
    print("✅ Directories created successfully")
    return True

def verify_installation():
    """Verify that all dependencies are working"""
    print("🔍 Verifying installation...")
    
    # Test Python imports
    try:
        import fitz  # PyMuPDF
        import PIL  # Pillow
        import pdfplumber
        import reportlab
        print("✅ Python packages import successfully")
    except ImportError as e:
        print(f"❌ Failed to import Python package: {e}")
        return False
    
    # Test system dependencies
    try:
        subprocess.run(["pdftoppm", "-h"], 
                      stdout=subprocess.DEVNULL, 
                      stderr=subprocess.DEVNULL, 
                      check=True)
        print("✅ Poppler is working")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Poppler not found or not working")
        return False
    
    try:
        subprocess.run(["tesseract", "--version"], 
                      stdout=subprocess.DEVNULL, 
                      stderr=subprocess.DEVNULL, 
                      check=True)
        print("✅ Tesseract is working")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Tesseract not found or not working")
        return False
    
    return True

def run_tests():
    """Run the test suite"""
    print("🧪 Running tests...")
    
    try:
        result = subprocess.run([
            sys.executable, "test_processor.py"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ All tests passed")
            return True
        else:
            print("❌ Some tests failed")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Failed to run tests: {e}")
        return False

def create_sample_files():
    """Create sample input files for testing"""
    print("📄 Creating sample files...")
    
    # Create a sample config with custom settings
    sample_config = {
        "text_replacements": {
            "DEEP Robotics": "CHIRAL",
            "云深处科技": "CHIRAL", 
            "www.deeprobotics.cn": "www.chiralrobotics.com"
        },
        "logo_settings": {
            "style": "modern",
            "color": "#1e3a5f"
        }
    }
    
    import json
    with open("config_sample.json", "w", encoding="utf-8") as f:
        json.dump(sample_config, f, indent=2, ensure_ascii=False)
    
    print("   Created: config_sample.json")
    
    # Create sample PDF using reportlab if available
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        sample_pdf_path = "input/sample_document.pdf"
        c = canvas.Canvas(sample_pdf_path, pagesize=letter)
        c.drawString(100, 750, "DEEP Robotics Sample Document")
        c.drawString(100, 700, "Visit: www.deeprobotics.cn") 
        c.drawString(100, 650, "Email: info@deeprobotics.cn")
        c.drawString(100, 600, "Product: JueyingLite3 Robot")
        c.drawString(100, 550, "Company: 云深处科技")
        c.save()
        
        print(f"   Created: {sample_pdf_path}")
        
    except ImportError:
        print("   Skipped sample PDF creation (reportlab not available)")
    
    return True

def main():
    """Main setup function"""
    print("🚀 CHIRAL Brand Processor Setup")
    print("=" * 50)
    
    steps = [
        ("Checking Python version", check_python_version),
        ("Installing system dependencies", install_system_dependencies),
        ("Installing Python dependencies", install_python_dependencies),
        ("Creating directories", create_directories),
        ("Creating sample files", create_sample_files),
        ("Verifying installation", verify_installation),
        ("Running tests", run_tests)
    ]
    
    failed_steps = []
    
    for step_name, step_function in steps:
        print(f"\n🔄 {step_name}...")
        
        try:
            if not step_function():
                failed_steps.append(step_name)
        except Exception as e:
            print(f"❌ {step_name} failed with exception: {e}")
            failed_steps.append(step_name)
    
    print("\n" + "=" * 50)
    print("SETUP SUMMARY")
    print("=" * 50)
    
    if not failed_steps:
        print("🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Place your PDF files in the 'input/' directory")
        print("2. Review and customize 'config.json' if needed")
        print("3. Run: python main.py process")
        return True
    else:
        print("❌ Setup completed with errors:")
        for step in failed_steps:
            print(f"   - {step}")
        print("\nPlease resolve the errors above and run setup again.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)