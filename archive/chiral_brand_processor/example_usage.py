#!/usr/bin/env python3
"""
Example Usage Script for CHIRAL Brand Processor
Demonstrates various usage patterns and advanced features
"""

import os
import sys
import json
from pathlib import Path

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import ChiralBrandProcessor
from pdf_processor import PDFProcessor
from text_replacer import TextReplacer
from logo_generator import LogoGenerator

def example_basic_usage():
    """Example 1: Basic usage with default configuration"""
    print("🔵 Example 1: Basic Processing")
    print("-" * 40)
    
    # Initialize processor
    processor = ChiralBrandProcessor()
    
    # Process all files in input directory
    processor.process_batch()
    
    print("✅ Basic processing complete\n")

def example_custom_config():
    """Example 2: Custom configuration"""
    print("🔵 Example 2: Custom Configuration")
    print("-" * 40)
    
    # Create custom configuration
    custom_config = {
        "text_replacements": {
            "DEEP Robotics": "CHIRAL Advanced Systems",
            "云深处科技": "CHIRAL 先进系统",
            "www.deeprobotics.cn": "www.chiral-advanced.com",
            "Jueying": "ChiralBot"
        },
        "logo_settings": {
            "font_family": "Arial",
            "color": "#2c3e50",  # Dark blue-gray
            "style": "tech",      # Tech style instead of modern
            "background": "white"
        },
        "output_naming": {
            "prefix": "ChiralAdvanced_",
            "suffix": "_Technical_Spec",
            "preserve_original": False
        },
        "product_naming": {
            "remove_prefix": ["Jueying", "绝影"],
            "add_prefix": "ChiralBot"
        }
    }
    
    # Save custom config
    config_path = "custom_config.json"
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(custom_config, f, indent=2, ensure_ascii=False)
    
    # Use custom config
    processor = ChiralBrandProcessor(config_path)
    
    # Process with custom settings
    processor.process_batch(input_dir="input", output_dir="output_custom")
    
    print("✅ Custom configuration processing complete\n")

def example_single_file_processing():
    """Example 3: Single file processing with preview"""
    print("🔵 Example 3: Single File Processing")
    print("-" * 40)
    
    processor = ChiralBrandProcessor()
    
    # Check if we have any PDF files
    input_dir = Path("input")
    pdf_files = list(input_dir.glob("*.pdf"))
    
    if not pdf_files:
        print("⚠️  No PDF files found in input directory")
        print("   Please add some PDF files to test single file processing")
        return
    
    # Process first PDF file
    input_file = pdf_files[0]
    print(f"Processing: {input_file.name}")
    
    # First, preview the changes
    print("\n📋 Preview of changes:")
    processor.preview_replacements(str(input_file))
    
    # Then process the file
    output_file = Path("output") / processor.generate_output_filename(input_file.name)
    success = processor.process_single_pdf(input_file, output_file)
    
    if success:
        print(f"✅ Successfully processed: {output_file}")
    else:
        print("❌ Processing failed")
    
    print()

def example_logo_generation():
    """Example 4: Logo generation and customization"""
    print("🔵 Example 4: Logo Generation")
    print("-" * 40)
    
    # Create logo generator with different styles
    styles = {
        'modern': {'color': '#1e3a5f', 'style': 'modern'},
        'tech': {'color': '#2c3e50', 'style': 'tech'},
        'minimal': {'color': '#34495e', 'style': 'minimal'}
    }
    
    for style_name, settings in styles.items():
        print(f"Generating {style_name} logo...")
        
        generator = LogoGenerator(settings)
        logo_path = generator.generate_logo((400, 150))
        
        # Rename to include style
        new_path = logo_path.parent / f"chiral_logo_{style_name}.png"
        if logo_path.exists():
            logo_path.rename(new_path)
            print(f"   ✅ Created: {new_path}")
    
    # Create complete brand kit
    print("Creating complete brand kit...")
    generator = LogoGenerator({'color': '#1e3a5f', 'style': 'modern'})
    brand_kit = generator.create_brand_kit()
    
    print(f"   ✅ Brand kit created with {len(brand_kit)} items")
    for name, path in brand_kit.items():
        print(f"      - {name}: {path}")
    
    print()

def example_text_replacement_analysis():
    """Example 5: Text replacement analysis"""
    print("🔵 Example 5: Text Replacement Analysis")  
    print("-" * 40)
    
    # Create text replacer
    rules = {
        "DEEP Robotics": "CHIRAL",
        "云深处科技": "CHIRAL",
        "www.deeprobotics.cn": "www.chiralrobotics.com",
        "Jueying": ""  # Remove completely
    }
    
    replacer = TextReplacer(rules)
    
    # Sample text for analysis
    sample_texts = [
        "DEEP Robotics is a leading robotics company. Visit www.deeprobotics.cn",
        "云深处科技专注于四足机器人研发",
        "JueyingLite3 is our flagship robot",
        "Contact DEEP Robotics at info@deeprobotics.cn for more information"
    ]
    
    print("Text replacement analysis:")
    print()
    
    for i, text in enumerate(sample_texts, 1):
        print(f"Sample {i}:")
        print(f"  Original: {text}")
        
        replaced_text, count = replacer._replace_text(text)
        print(f"  Modified: {replaced_text}")
        print(f"  Changes:  {count} replacements made")
        print()
    
    # Test product naming
    product_text = "JueyingLite3 and Jueying X20 are our main products"
    updated_text = replacer._update_product_names(product_text)
    print(f"Product naming:")
    print(f"  Original: {product_text}")
    print(f"  Updated:  {updated_text}")
    print()

def example_batch_with_statistics():
    """Example 6: Batch processing with detailed statistics"""
    print("🔵 Example 6: Batch Processing with Statistics")
    print("-" * 40)
    
    processor = ChiralBrandProcessor()
    
    # Get list of PDF files
    input_dir = Path("input")
    pdf_files = list(input_dir.glob("*.pdf"))
    
    if not pdf_files:
        print("⚠️  No PDF files found for statistics demo")
        return
    
    print(f"Found {len(pdf_files)} PDF files:")
    for pdf_file in pdf_files:
        print(f"  - {pdf_file.name}")
    
    # Analyze each file before processing
    total_replacements = {}
    
    for pdf_file in pdf_files:
        print(f"\nAnalyzing {pdf_file.name}...")
        
        try:
            pdf_data = processor.pdf_processor.load_pdf(pdf_file)
            stats = processor.text_replacer.get_replacement_stats(pdf_data)
            
            print("  Potential replacements:")
            for rule, count in stats.items():
                if count > 0:
                    print(f"    - '{rule}': {count} instances")
                    total_replacements[rule] = total_replacements.get(rule, 0) + count
        
        except Exception as e:
            print(f"  ❌ Error analyzing {pdf_file.name}: {e}")
    
    print("\n📊 Total Replacement Statistics:")
    for rule, total_count in total_replacements.items():
        print(f"  - '{rule}': {total_count} total instances across all files")
    
    # Now process all files
    print("\n🔄 Processing all files...")
    processor.process_batch()
    
    print("✅ Batch processing with statistics complete\n")

def example_advanced_configuration():
    """Example 7: Advanced configuration features"""
    print("🔵 Example 7: Advanced Configuration")
    print("-" * 40)
    
    # Create advanced configuration
    advanced_config = {
        "text_replacements": {
            "DEEP Robotics": "CHIRAL",
            "云深处科技": "CHIRAL"
        },
        "product_naming": {
            "remove_prefix": ["Jueying", "绝影"],
            "add_prefix": "Chiral",
            "model_names": ["Lite3", "X20", "Mini", "X30", "J60Joint"],
            "preserve_models": True
        },
        "logo_settings": {
            "variations": {
                "standard": {"color": "#1e3a5f", "background": "transparent"},
                "white_bg": {"color": "#1e3a5f", "background": "white"},
                "dark": {"color": "#ffffff", "background": "#2c3e50"}
            }
        },
        "processing": {
            "preserve_layout": True,
            "quality": "high",
            "backup_original": True,
            "auto_resize_logos": True,
            "dpi": 300
        },
        "quality_control": {
            "validate_urls": True,
            "validate_emails": True,
            "preserve_formatting": True,
            "verify_replacements": True
        },
        "contact_info": {
            "company_name": "Chiral Robotics",
            "website": "www.chiralrobotics.com",
            "email_domain": "chiralrobotics.com",
            "phone": "+1-XXX-XXX-XXXX",
            "address": "123 Robotics Ave, Tech City, TC 12345"
        },
        "language_settings": {
            "primary_language": "en",
            "support_chinese": True,
            "chinese_replacements": {
                "机器狗": "Quadruped Robot",
                "四足机器人": "Quadruped Robot"
            }
        }
    }
    
    # Save advanced config
    config_path = "advanced_config.json"
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(advanced_config, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created advanced configuration: {config_path}")
    print("Features enabled:")
    print("  - Quality control validation")
    print("  - Multiple logo variations")
    print("  - Chinese language support")
    print("  - Original file backup")
    print("  - High-quality output (300 DPI)")
    print()

def example_error_handling():
    """Example 8: Error handling and recovery"""
    print("🔵 Example 8: Error Handling")
    print("-" * 40)
    
    processor = ChiralBrandProcessor()
    
    # Test processing non-existent file
    print("Testing error handling with non-existent file...")
    non_existent = Path("input/non_existent.pdf")
    output_path = Path("output/test_output.pdf")
    
    success = processor.process_single_pdf(non_existent, output_path)
    if not success:
        print("✅ Error properly handled for non-existent file")
    
    # Test with corrupted config
    print("Testing with invalid configuration...")
    invalid_config = "invalid_config.json"
    
    try:
        with open(invalid_config, 'w') as f:
            f.write("{ invalid json content")
        
        # This should handle the JSON error gracefully
        processor = ChiralBrandProcessor(invalid_config)
        print("❌ Should have caught JSON error")
    
    except Exception as e:
        print(f"✅ JSON error properly caught: {type(e).__name__}")
    
    finally:
        # Cleanup
        if os.path.exists(invalid_config):
            os.remove(invalid_config)
    
    print()

def main():
    """Run all examples"""
    print("🚀 CHIRAL Brand Processor - Usage Examples")
    print("=" * 60)
    print()
    
    examples = [
        example_basic_usage,
        example_custom_config,
        example_single_file_processing,
        example_logo_generation,
        example_text_replacement_analysis,
        example_batch_with_statistics,
        example_advanced_configuration,
        example_error_handling
    ]
    
    for i, example_func in enumerate(examples, 1):
        try:
            example_func()
        except Exception as e:
            print(f"❌ Example {i} failed: {e}")
        
        if i < len(examples):
            input("Press Enter to continue to next example...")
            print()
    
    print("🎉 All examples completed!")
    print()
    print("💡 Tips for production use:")
    print("   1. Always test with sample files first")
    print("   2. Keep backups of original files")
    print("   3. Review the processing logs")
    print("   4. Validate output quality manually")
    print("   5. Customize config.json for your specific needs")

if __name__ == "__main__":
    main()