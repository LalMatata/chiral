#!/usr/bin/env python3
"""
Simple PDF text extraction without heavy dependencies
"""

import subprocess
import os
from pathlib import Path

def extract_pdf_text_simple(pdf_path):
    """Extract text from PDF using system tools"""
    
    # Try pdftotext (part of poppler-utils)
    try:
        result = subprocess.run([
            'pdftotext', str(pdf_path), '-'
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and result.stdout:
            print(f"✅ Extracted text using pdftotext")
            return result.stdout
        else:
            print(f"❌ pdftotext failed: {result.stderr}")
    
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        print(f"⚠️  pdftotext not available: {e}")
    
    # Try using strings command as fallback
    try:
        result = subprocess.run([
            'strings', str(pdf_path)
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and result.stdout:
            print(f"⚠️  Using strings command as fallback")
            return result.stdout
        
    except Exception as e:
        print(f"❌ strings command failed: {e}")
    
    return None

def process_pdf_as_text(pdf_path):
    """Process PDF by extracting text and applying transformations"""
    
    print(f"🔍 Processing PDF: {pdf_path}")
    
    # Extract text from PDF
    extracted_text = extract_pdf_text_simple(pdf_path)
    
    if not extracted_text:
        print("❌ Could not extract text from PDF")
        return False
    
    print(f"📊 Extracted {len(extracted_text)} characters from PDF")
    
    # Save extracted text
    text_path = Path("input") / f"{Path(pdf_path).stem}_extracted.txt"
    with open(text_path, 'w', encoding='utf-8') as f:
        f.write(extracted_text)
    
    print(f"💾 Saved extracted text to: {text_path}")
    
    # Apply our brand replacement logic
    from demo_processor import DemoTextReplacer
    replacer = DemoTextReplacer()
    
    processed_text, changes = replacer.process_text(extracted_text)
    
    # Save processed text
    output_path = Path("output") / f"Chiral_{Path(pdf_path).stem}_PDF_Processed.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(processed_text)
    
    print(f"✅ Processed PDF content saved to: {output_path}")
    print(f"📈 Total changes made: {changes}")
    
    # Show sample of changes
    print(f"\n📋 Sample of processed content:")
    print("-" * 40)
    lines = processed_text.split('\n')[:10]
    for line in lines:
        if line.strip():
            print(f"   {line}")
    if len(processed_text.split('\n')) > 10:
        print("   ...")
    
    return True

def main():
    """Main function"""
    print("📄 PDF Text Processor")
    print("=" * 40)
    
    # Look for PDF files
    input_dir = Path("input")
    pdf_files = list(input_dir.glob("*.pdf"))
    
    if not pdf_files:
        print("❌ No PDF files found in input directory")
        return
    
    print(f"📁 Found {len(pdf_files)} PDF files:")
    for pdf in pdf_files:
        print(f"   - {pdf.name}")
    
    # Process each PDF
    for pdf_path in pdf_files:
        print(f"\n{'='*60}")
        success = process_pdf_as_text(pdf_path)
        
        if success:
            print(f"✅ Successfully processed {pdf_path.name}")
        else:
            print(f"❌ Failed to process {pdf_path.name}")

if __name__ == "__main__":
    main()