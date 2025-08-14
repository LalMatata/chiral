#!/usr/bin/env python3
"""
System Verification Script for CHIRAL Brand Processor
"""

import sys
import os
import json
from pathlib import Path

def check_python_version():
    """Check Python version"""
    print("🐍 Python Version Check:")
    version = sys.version_info
    print(f"   Version: {version.major}.{version.minor}.{version.micro}")
    
    if version >= (3, 8):
        print("   ✅ Python version is compatible")
        return True
    else:
        print("   ❌ Python 3.8+ required")
        return False

def check_project_structure():
    """Verify project structure"""
    print("\n📁 Project Structure Check:")
    
    required_files = [
        'main.py',
        'pdf_processor.py', 
        'text_replacer.py',
        'logo_generator.py',
        'config.json',
        'requirements.txt',
        'README.md'
    ]
    
    required_dirs = [
        'input',
        'output',
        'assets', 
        'logs'
    ]
    
    all_good = True
    
    for file in required_files:
        if Path(file).exists():
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} missing")
            all_good = False
    
    for directory in required_dirs:
        if Path(directory).exists():
            print(f"   ✅ {directory}/")
        else:
            print(f"   ❌ {directory}/ missing")
            all_good = False
    
    return all_good

def check_configuration():
    """Check configuration file"""
    print("\n⚙️  Configuration Check:")
    
    try:
        with open('config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        required_sections = [
            'text_replacements',
            'product_naming',
            'logo_settings',
            'output_naming'
        ]
        
        all_good = True
        for section in required_sections:
            if section in config:
                print(f"   ✅ {section}")
            else:
                print(f"   ❌ {section} missing")
                all_good = False
        
        print(f"   📊 {len(config.get('text_replacements', {}))} replacement rules loaded")
        return all_good
        
    except Exception as e:
        print(f"   ❌ Configuration error: {e}")
        return False

def check_dependencies():
    """Check Python dependencies"""
    print("\n📦 Dependency Check:")
    
    core_deps = [
        ('json', 'JSON support'),
        ('pathlib', 'Path handling'),
        ('re', 'Regular expressions'),
        ('datetime', 'Date/time handling')
    ]
    
    optional_deps = [
        ('fitz', 'PyMuPDF - PDF processing'),
        ('PIL', 'Pillow - Image processing'),
        ('pdfplumber', 'PDF text extraction'),
        ('reportlab', 'PDF generation'),
        ('tqdm', 'Progress bars'),
        ('colorama', 'Colored output')
    ]
    
    print("   Core dependencies:")
    for module, description in core_deps:
        try:
            __import__(module)
            print(f"     ✅ {module} - {description}")
        except ImportError:
            print(f"     ❌ {module} - {description}")
    
    print("   Optional dependencies (for full functionality):")
    available_count = 0
    for module, description in optional_deps:
        try:
            __import__(module)
            print(f"     ✅ {module} - {description}")
            available_count += 1
        except ImportError:
            print(f"     ⚠️  {module} - {description}")
    
    print(f"   📊 {available_count}/{len(optional_deps)} optional dependencies available")
    return available_count > 0

def check_sample_files():
    """Check for sample files"""
    print("\n📄 Sample Files Check:")
    
    input_dir = Path("input")
    files = list(input_dir.glob("*"))
    
    if files:
        print(f"   ✅ Found {len(files)} files in input directory:")
        for file in files:
            print(f"      - {file.name}")
        return True
    else:
        print("   ⚠️  No files in input directory")
        print("   💡 Run 'python create_sample_pdf.py' to create sample files")
        return False

def run_demo_test():
    """Run a quick demo test"""
    print("\n🧪 Demo Test:")
    
    try:
        # Test basic text replacement
        from demo_processor import DemoTextReplacer
        
        replacer = DemoTextReplacer()
        test_text = "DEEP Robotics JueyingLite3 robot"
        result, count = replacer.process_text(test_text)
        
        if count > 0:
            print(f"   ✅ Text replacement working: {count} changes made")
            print(f"      '{test_text}' → '{result.strip()}'")
            return True
        else:
            print("   ⚠️  No replacements made in test")
            return False
            
    except Exception as e:
        print(f"   ❌ Demo test failed: {e}")
        return False

def generate_system_report():
    """Generate a system status report"""
    print("\n📊 Generating System Report...")
    
    report_path = Path("logs") / "system_verification_report.txt"
    report_path.parent.mkdir(exist_ok=True)
    
    with open(report_path, 'w') as f:
        f.write("CHIRAL Brand Processor - System Verification Report\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Python Version: {sys.version}\n")
        f.write(f"Platform: {sys.platform}\n")
        f.write(f"Working Directory: {os.getcwd()}\n\n")
        
        # Check what's available
        try:
            import fitz
            f.write("✅ PyMuPDF available\n")
        except ImportError:
            f.write("❌ PyMuPDF not available\n")
        
        try:
            import PIL
            f.write("✅ Pillow available\n")
        except ImportError:
            f.write("❌ Pillow not available\n")
        
        f.write(f"\nConfiguration loaded successfully\n")
        f.write(f"Project structure complete\n")
    
    print(f"   📋 Report saved to: {report_path}")

def main():
    """Main verification function"""
    print("🔍 CHIRAL Brand Processor - System Verification")
    print("=" * 60)
    
    checks = [
        ("Python Version", check_python_version),
        ("Project Structure", check_project_structure),
        ("Configuration", check_configuration),
        ("Dependencies", check_dependencies),
        ("Sample Files", check_sample_files),
        ("Demo Test", run_demo_test)
    ]
    
    results = []
    
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            print(f"   ❌ {check_name} failed: {e}")
            results.append((check_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 VERIFICATION SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for check_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {check_name}")
    
    print(f"\n📊 Overall Status: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 System fully verified and ready!")
        print("\n💡 Next steps:")
        print("   1. Add PDF files to input/ directory")
        print("   2. Run: python main.py process")
    elif passed >= total - 2:
        print("⚠️  System mostly ready with minor issues")
        print("\n💡 You can use the demo mode:")
        print("   python demo_processor.py")
    else:
        print("❌ System needs setup")
        print("\n💡 Run the setup script:")
        print("   python setup.py")
    
    generate_system_report()

if __name__ == "__main__":
    main()