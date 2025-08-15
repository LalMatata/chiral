#!/usr/bin/env python3
"""
Simple Real PDF Processor - Extract and process PDF content
"""

import subprocess
from pathlib import Path
from demo_processor import DemoTextReplacer

def extract_pdf_text(pdf_path):
    """Extract text from PDF using available tools"""
    
    print(f"🔍 Extracting from: {pdf_path.name}")
    
    # Try strings command first (most reliable)
    try:
        result = subprocess.run([
            'strings', str(pdf_path)
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and result.stdout:
            text = result.stdout
            # Filter out very short lines and non-meaningful content
            lines = [line.strip() for line in text.split('\n') 
                    if len(line.strip()) > 3 and any(c.isalpha() for c in line)]
            
            if lines:
                print(f"  ✅ Extracted {len(lines)} text lines")
                return '\n'.join(lines)
    
    except Exception as e:
        print(f"  ❌ Extraction failed: {e}")
    
    return None

def process_real_pdf(pdf_path):
    """Process a single real PDF"""
    
    print(f"\n{'='*50}")
    print(f"Processing: {pdf_path.name}")
    
    # Extract text
    text = extract_pdf_text(pdf_path)
    if not text:
        print("❌ No text extracted")
        return False
    
    print(f"📊 Extracted text length: {len(text)} characters")
    
    # Save extracted text
    extract_path = Path("input") / f"{pdf_path.stem}_extracted.txt"
    with open(extract_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"💾 Saved: {extract_path}")
    
    # Apply brand processing
    replacer = DemoTextReplacer()
    processed, changes = replacer.process_text(text)
    
    # Save processed result
    output_path = Path("output") / f"Chiral_{pdf_path.stem}_Real.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(processed)
    
    print(f"✅ Processed: {output_path}")
    print(f"📈 Changes: {changes}")
    
    return True

def main():
    """Main processing function"""
    
    print("🔄 Real PDF Processing")
    print("=" * 30)
    
    # Find real PDF files (exclude our test files)
    input_dir = Path("input")
    pdfs = [f for f in input_dir.glob("*.pdf") 
           if not f.name.startswith(('JueyingLite3_', 'test'))]
    
    print(f"📁 Found {len(pdfs)} real PDFs:")
    for pdf in pdfs:
        print(f"   - {pdf.name}")
    
    # Process each
    success = 0
    for pdf in pdfs:
        if process_real_pdf(pdf):
            success += 1
    
    print(f"\n🎉 Completed: {success}/{len(pdfs)} successful")

if __name__ == "__main__":
    main()