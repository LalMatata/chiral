#!/usr/bin/env python3
"""
Process Real PDF Files - Extract text and apply CHIRAL branding
"""

import os
import subprocess
import tempfile
from pathlib import Path
from demo_processor import DemoTextReplacer

def try_pdf_to_text(pdf_path):
    """Try multiple methods to extract text from PDF"""
    
    print(f"📄 Attempting to extract text from: {pdf_path.name}")
    
    # Method 1: Try pdftotext (if available)
    try:
        result = subprocess.run([
            'pdftotext', str(pdf_path), '-'
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0 and result.stdout.strip():
            print("  ✅ Extracted using pdftotext")
            return result.stdout
        else:
            print("  ❌ pdftotext failed or no text found")
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("  ⚠️  pdftotext not available")
    
    # Method 2: Try strings command
    try:
        result = subprocess.run([
            'strings', str(pdf_path)
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0 and result.stdout.strip():
            print("  ⚠️  Using strings command (basic extraction)")
            return result.stdout
        else:
            print("  ❌ strings command failed")
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("  ⚠️  strings command not available")
    
    # Method 3: Try hexdump to look for readable text
    try:
        result = subprocess.run([
            'hexdump', '-C', str(pdf_path)
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            # Look for readable text patterns
            text_parts = []
            lines = result.stdout.split('\n')
            
            for line in lines:
                # Look for ASCII text in hexdump output
                if '|' in line:
                    ascii_part = line.split('|')[1] if '|' in line else ''
                    clean_text = ''.join(c if c.isprintable() and c not in '|' else ' ' for c in ascii_part)
                    if len(clean_text.strip()) > 3:  # Only keep meaningful text
                        text_parts.append(clean_text.strip())
            
            if text_parts:
                extracted = '\n'.join(text_parts)
                print("  ⚠️  Using hexdump extraction (may be incomplete)")
                return extracted
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("  ❌ hexdump not available")
    
    # Method 4: Read as binary and look for text patterns
    try:
        with open(pdf_path, 'rb') as f:
            content = f.read()
        
        # Look for common PDF text patterns
        text_parts = []
        
        # Convert to string and look for readable segments
        try:
            # Try to decode parts as UTF-8
            for i in range(0, len(content), 1024):
                chunk = content[i:i+1024]
                try:
                    decoded = chunk.decode('utf-8', errors='ignore')
                    # Look for words that might be in our documents
                    words = decoded.split()
                    readable_words = [w for w in words if len(w) > 2 and w.isalpha()]
                    if len(readable_words) > 3:
                        text_parts.extend(readable_words)
                except:
                    continue
            
            if text_parts:
                extracted = ' '.join(text_parts)
                print(f"  ⚠️  Binary extraction found {len(text_parts)} words")
                return extracted
                
        except Exception as e:
            print(f"  ❌ Binary extraction failed: {e}")
    
    print("  ❌ Could not extract text from PDF")
    return None

def process_single_real_pdf(pdf_path):
    """Process a single real PDF file"""
    
    print(f"\n{'='*60}")
    print(f"🔄 Processing: {pdf_path.name}")
    print(f"📊 File size: {pdf_path.stat().st_size:,} bytes")
    
    # Extract text
    extracted_text = try_pdf_to_text(pdf_path)
    
    if not extracted_text:
        print("❌ Failed to extract text")
        return False
    
    print(f"📝 Extracted {len(extracted_text)} characters")
    
    # Save extracted text for reference
    text_path = Path("input") / f"{pdf_path.stem}_extracted.txt"
    with open(text_path, 'w', encoding='utf-8') as f:
        f.write(extracted_text)
    print(f"💾 Saved extracted text: {text_path}")
    
    # Apply CHIRAL brand replacements
    replacer = DemoTextReplacer()
    processed_text, changes = replacer.process_text(extracted_text)
    
    # Save processed result
    output_path = Path("output") / f"Chiral_{pdf_path.stem}_PDF_Processed.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(processed_text)
    
    print(f"✅ Processed file saved: {output_path}")
    print(f"📈 Brand changes made: {changes}")
    
    # Show preview of changes
    if changes > 0:
        print(f"\n📋 Preview of processed content:")
        print("-" * 40)
        lines = processed_text.split('\n')[:8]
        for line in lines:
            if line.strip() and len(line.strip()) > 5:
                print(f"   {line.strip()[:80]}...")
        print("-" * 40)
    
    return True

def process_all_real_pdfs():
    """Process all real PDF files"""
    
    print("🚀 CHIRAL Brand Processor - Real PDF Processing")
    print("=" * 70)
    
    # Find PDF files
    input_dir = Path("input")
    pdf_files = [f for f in input_dir.glob("*.pdf") 
                if not f.name.startswith('JueyingLite3_')]  # Skip our test files
    
    if not pdf_files:
        print("❌ No real PDF files found")
        return
    
    print(f"📁 Found {len(pdf_files)} real PDF files to process:")
    for i, pdf in enumerate(pdf_files, 1):
        print(f"   {i}. {pdf.name}")
    
    # Process each PDF
    successful = 0
    failed = []
    
    for pdf_path in pdf_files:
        try:
            if process_single_real_pdf(pdf_path):
                successful += 1
            else:
                failed.append(pdf_path.name)
        except Exception as e:
            print(f"❌ Error processing {pdf_path.name}: {e}")
            failed.append(pdf_path.name)
    
    # Summary
    print(f"\n{'='*70}")
    print("📊 PROCESSING SUMMARY")
    print(f"{'='*70}")
    print(f"✅ Successfully processed: {successful}/{len(pdf_files)} files")
    
    if failed:
        print(f"❌ Failed files:")
        for file in failed:
            print(f"   - {file}")
    
    # List all output files
    output_dir = Path("output")
    pdf_outputs = list(output_dir.glob("*_PDF_Processed.txt"))
    
    if pdf_outputs:
        print(f"\n📄 Generated CHIRAL-branded documents:")
        for output in pdf_outputs:
            print(f"   ✓ {output.name}")
    
    print(f"\n🎉 Real PDF processing complete!")
    return successful > 0

if __name__ == "__main__":
    process_all_real_pdfs()