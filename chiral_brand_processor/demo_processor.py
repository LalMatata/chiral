#!/usr/bin/env python3
"""
Demo version of CHIRAL Brand Processor - Works without heavy dependencies
Demonstrates text replacement functionality
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

class DemoTextReplacer:
    """Simplified text replacer for demonstration"""
    
    def __init__(self, config_path="config.json"):
        """Load configuration"""
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.rules = config['text_replacements']
        self.product_config = config['product_naming']
        
        print(f"📋 Loaded {len(self.rules)} replacement rules")
        
    def process_text(self, text):
        """Process text with all replacement rules"""
        original_text = text
        replacement_count = 0
        
        # Apply basic text replacements
        for old_text, new_text in self.rules.items():
            if old_text in text:
                count_before = text.count(old_text)
                text = text.replace(old_text, new_text)
                replacement_count += count_before
                
                if count_before > 0:
                    print(f"  ✅ '{old_text}' → '{new_text}' ({count_before} times)")
        
        # Apply product naming changes
        text = self.update_product_names(text)
        
        return text, replacement_count
    
    def update_product_names(self, text):
        """Update product naming"""
        # Remove old prefixes and add new ones
        for old_prefix in self.product_config['remove_prefix']:
            for model in ['Lite3', 'Lite2', 'X20', 'Mini', 'X30', 'J60Joint']:
                old_pattern = f"{old_prefix}{model}"
                new_pattern = f"{self.product_config['add_prefix']} {model}"
                
                if old_pattern in text:
                    text = text.replace(old_pattern, new_pattern)
                    print(f"  🔄 Product: '{old_pattern}' → '{new_pattern}'")
        
        return text
    
    def preview_changes(self, text):
        """Preview what changes would be made"""
        print("🔍 Preview of potential changes:")
        print("-" * 50)
        
        changes_found = False
        
        # Check for text replacements
        for old_text, new_text in self.rules.items():
            if old_text in text:
                count = text.count(old_text)
                print(f"  '{old_text}' → '{new_text}' ({count} instances)")
                changes_found = True
        
        # Check for product naming changes
        for old_prefix in self.product_config['remove_prefix']:
            if old_prefix in text:
                print(f"  Remove product prefix: '{old_prefix}'")
                changes_found = True
        
        if not changes_found:
            print("  No changes would be made to this text.")
        
        print("-" * 50)
        return changes_found

def create_demo_logo():
    """Create a simple text-based logo"""
    logo_styles = {
        'standard': """
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║    ▄████▄   ██   ██ ██ ██████   ▄████▄   ║
    ║   ██       ██   ██ ██ ██   ██  ██   ██   ║
    ║   ██       ███████ ██ ██████   ███████   ║
    ║   ██       ██   ██ ██ ██   ██  ██   ██   ║
    ║    ▀████▀  ██   ██ ██ ██   ██  ██   ██   ║
    ║                                           ║
    ║           Advanced Robotics               ║
    ╚═══════════════════════════════════════════╝
    """,
        'simple': """
    ┌─────────────────────────┐
    │       C H I R A L       │
    │   Advanced Robotics     │
    └─────────────────────────┘
    """
    }
    
    return logo_styles

def demo_complete_workflow():
    """Demonstrate the complete workflow"""
    print("🚀 CHIRAL Brand Processor - Demo Mode")
    print("=" * 60)
    
    # Initialize components
    replacer = DemoTextReplacer()
    
    # Check for input files
    input_dir = Path("input")
    text_files = list(input_dir.glob("*.txt"))
    
    if not text_files:
        print("❌ No text files found in input directory")
        return
    
    print(f"📁 Found {len(text_files)} files to process:")
    for file in text_files:
        print(f"   - {file.name}")
    
    # Process each file
    for file_path in text_files:
        print(f"\n📄 Processing: {file_path.name}")
        print("=" * 40)
        
        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        print(f"📊 Original file size: {len(original_content)} characters")
        
        # Preview changes
        changes_found = replacer.preview_changes(original_content)
        
        if changes_found:
            # Apply changes
            print("\n🔄 Applying changes...")
            modified_content, change_count = replacer.process_text(original_content)
            
            # Generate output filename
            output_dir = Path("output")
            output_dir.mkdir(exist_ok=True)
            
            output_filename = f"Chiral_{file_path.stem}_Datasheet.txt"
            output_path = output_dir / output_filename
            
            # Save processed file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            
            print(f"✅ Saved processed file: {output_path}")
            print(f"📈 Total changes made: {change_count}")
            
            # Show sample of changes
            print("\n📋 Sample of processed content:")
            print("-" * 40)
            lines = modified_content.split('\n')[:10]
            for line in lines:
                if line.strip():
                    print(f"   {line}")
            if len(modified_content.split('\n')) > 10:
                print("   ...")
        else:
            print("ℹ️  No changes needed for this file")
    
    # Generate demo logos
    print(f"\n🎨 Generated CHIRAL Logos:")
    print("-" * 40)
    
    logos = create_demo_logo()
    for style, logo in logos.items():
        print(f"{style.capitalize()} Style:")
        print(logo)
    
    # Create summary report
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_path = Path("logs") / f"demo_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    report_path.parent.mkdir(exist_ok=True)
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("CHIRAL Brand Processor - Demo Report\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Timestamp: {timestamp}\n")
        f.write(f"Files processed: {len(text_files)}\n")
        f.write(f"Replacement rules: {len(replacer.rules)}\n\n")
        
        f.write("Replacement Rules Applied:\n")
        f.write("-" * 30 + "\n")
        for old, new in replacer.rules.items():
            f.write(f"'{old}' → '{new}'\n")
    
    print(f"\n📊 Demo report saved: {report_path}")
    
    print("\n🎉 Demo complete!")
    print("=" * 60)
    print("💡 This demo shows the text replacement functionality.")
    print("   For full PDF processing, install the dependencies:")
    print("   pip install -r requirements.txt")

if __name__ == "__main__":
    demo_complete_workflow()