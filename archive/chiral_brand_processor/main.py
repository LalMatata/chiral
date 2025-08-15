#!/usr/bin/env python3
"""
CHIRAL Brand Processor - Main Application
Converts DEEP Robotics PDF documents to CHIRAL branding
"""

import os
import sys
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from tqdm import tqdm
import colorama
from colorama import Fore, Style

from pdf_processor import PDFProcessor
from text_replacer import TextReplacer
from logo_generator import LogoGenerator

colorama.init(autoreset=True)

class ChiralBrandProcessor:
    """Main application class for brand replacement"""
    
    def __init__(self, config_path: str = "config.json"):
        """Initialize the brand processor"""
        self.config = self.load_config(config_path)
        self.setup_logging()
        self.pdf_processor = PDFProcessor()
        self.text_replacer = TextReplacer(self.config['text_replacements'])
        self.logo_generator = LogoGenerator(self.config['logo_settings'])
        
    def load_config(self, config_path: str) -> Dict:
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"{Fore.YELLOW}Configuration file not found. Creating default config...")
            self.create_default_config(config_path)
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    
    def create_default_config(self, config_path: str):
        """Create default configuration file"""
        default_config = {
            "text_replacements": {
                "DEEP Robotics": "CHIRAL",
                "云深处科技": "CHIRAL",
                "DeepRobotics Co.,Ltd.": "Chiral Robotics",
                "杭州云深处科技有限公司": "Chiral Robotics",
                "www.deeprobotics.cn": "www.chiralrobotics.com",
                "@deeprobotics.cn": "@chiralrobotics.com",
                "0571-85073796": "[Contact TBD]",
                "浙江省杭州市西湖区": "[Address TBD]",
                "中国杭州": "[Address TBD]"
            },
            "product_naming": {
                "remove_prefix": ["Jueying", "绝影"],
                "add_prefix": "Chiral"
            },
            "logo_settings": {
                "font_family": "Arial",
                "font_weight": "bold",
                "color": "#1e3a5f",
                "background": "transparent",
                "size": "auto",
                "style": "modern"
            },
            "output_naming": {
                "prefix": "Chiral_",
                "suffix": "_Datasheet",
                "preserve_original": False
            },
            "processing": {
                "preserve_layout": True,
                "quality": "high",
                "compression": "standard",
                "backup_original": True
            }
        }
        
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=2, ensure_ascii=False)
    
    def setup_logging(self):
        """Setup logging configuration"""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = log_dir / f"processing_{timestamp}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def process_single_pdf(self, input_path: Path, output_path: Path) -> bool:
        """Process a single PDF file"""
        try:
            self.logger.info(f"Processing: {input_path.name}")
            
            # Load PDF
            pdf_content = self.pdf_processor.load_pdf(input_path)
            
            # Replace text content
            modified_content = self.text_replacer.replace_all(pdf_content)
            
            # Generate and replace logo
            logo_path = self.logo_generator.generate_logo()
            modified_content = self.pdf_processor.replace_logo(
                modified_content, 
                logo_path
            )
            
            # Update product naming
            modified_content = self.update_product_naming(modified_content)
            
            # Save modified PDF
            self.pdf_processor.save_pdf(modified_content, output_path)
            
            self.logger.info(f"Successfully processed: {output_path.name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error processing {input_path.name}: {str(e)}")
            return False
    
    def update_product_naming(self, content: Dict) -> Dict:
        """Update product naming according to configuration"""
        naming_config = self.config.get('product_naming', {})
        
        # Remove old prefixes
        for prefix in naming_config.get('remove_prefix', []):
            content = self.text_replacer.remove_prefix(content, prefix)
        
        # Add new prefix
        new_prefix = naming_config.get('add_prefix', 'Chiral')
        content = self.text_replacer.add_product_prefix(content, new_prefix)
        
        return content
    
    def process_batch(self, input_dir: str = "input", output_dir: str = "output"):
        """Process all PDF files in the input directory"""
        input_path = Path(input_dir)
        output_path = Path(output_dir)
        
        # Ensure directories exist
        input_path.mkdir(exist_ok=True)
        output_path.mkdir(exist_ok=True)
        
        # Find all PDF files
        pdf_files = list(input_path.glob("*.pdf"))
        
        if not pdf_files:
            print(f"{Fore.YELLOW}No PDF files found in {input_dir}")
            return
        
        print(f"{Fore.GREEN}Found {len(pdf_files)} PDF files to process")
        
        # Process each file with progress bar
        success_count = 0
        failed_files = []
        
        with tqdm(pdf_files, desc="Processing PDFs", unit="file") as pbar:
            for pdf_file in pbar:
                pbar.set_description(f"Processing {pdf_file.name}")
                
                # Generate output filename
                output_filename = self.generate_output_filename(pdf_file.name)
                output_file = output_path / output_filename
                
                # Process the file
                if self.process_single_pdf(pdf_file, output_file):
                    success_count += 1
                else:
                    failed_files.append(pdf_file.name)
        
        # Print summary
        print(f"\n{Fore.GREEN}Processing complete!")
        print(f"  ✓ Successfully processed: {success_count}/{len(pdf_files)} files")
        
        if failed_files:
            print(f"{Fore.RED}  ✗ Failed files:")
            for file in failed_files:
                print(f"    - {file}")
        
        # Generate report
        self.generate_report(pdf_files, success_count, failed_files)
    
    def generate_output_filename(self, original_name: str) -> str:
        """Generate output filename based on configuration"""
        naming = self.config.get('output_naming', {})
        
        # Remove .pdf extension
        base_name = original_name.replace('.pdf', '')
        
        # Apply prefix and suffix
        prefix = naming.get('prefix', '')
        suffix = naming.get('suffix', '')
        
        # Clean up product names
        for old_prefix in self.config['product_naming'].get('remove_prefix', []):
            base_name = base_name.replace(old_prefix, '')
        
        # Build new filename
        new_name = f"{prefix}{base_name.strip()}{suffix}.pdf"
        
        return new_name
    
    def generate_report(self, files: List[Path], success: int, failed: List[str]):
        """Generate processing report"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        report_path = Path("logs") / f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("=" * 60 + "\n")
            f.write("CHIRAL Brand Processor - Processing Report\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write(f"Total files: {len(files)}\n")
            f.write(f"Successful: {success}\n")
            f.write(f"Failed: {len(failed)}\n\n")
            
            f.write("Processed Files:\n")
            f.write("-" * 40 + "\n")
            for file in files:
                status = "✓" if file.name not in failed else "✗"
                f.write(f"{status} {file.name}\n")
            
            f.write("\n" + "=" * 60 + "\n")
            f.write("Configuration Used:\n")
            f.write("-" * 40 + "\n")
            f.write(json.dumps(self.config, indent=2, ensure_ascii=False))
        
        print(f"{Fore.CYAN}Report saved to: {report_path}")
    
    def preview_replacements(self, pdf_path: str):
        """Preview text replacements for a PDF file"""
        print(f"\n{Fore.CYAN}Preview mode for: {pdf_path}")
        print("=" * 60)
        
        # Load and analyze PDF
        pdf_content = self.pdf_processor.load_pdf(Path(pdf_path))
        replacements = self.text_replacer.find_replacements(pdf_content)
        
        if replacements:
            print(f"{Fore.GREEN}Found {len(replacements)} potential replacements:\n")
            for old, new, context in replacements:
                print(f"  {Fore.YELLOW}{old} → {Fore.GREEN}{new}")
                print(f"  Context: ...{context}...")
                print()
        else:
            print(f"{Fore.YELLOW}No replacements found")
        
        print("=" * 60)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='CHIRAL Brand Processor - Convert DEEP Robotics PDFs to CHIRAL branding',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        'command',
        choices=['process', 'preview', 'single'],
        help='Command to execute'
    )
    
    parser.add_argument(
        '--input',
        default='input',
        help='Input directory for batch processing (default: input)'
    )
    
    parser.add_argument(
        '--output',
        default='output',
        help='Output directory for processed files (default: output)'
    )
    
    parser.add_argument(
        '--file',
        help='Single PDF file to process or preview'
    )
    
    parser.add_argument(
        '--config',
        default='config.json',
        help='Configuration file path (default: config.json)'
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose output'
    )
    
    args = parser.parse_args()
    
    # ASCII Art Banner
    print(f"{Fore.CYAN}")
    print("""
    ╔═══════════════════════════════════════════╗
    ║   CHIRAL Brand Processor v1.0            ║
    ║   PDF Document Rebranding System         ║
    ╚═══════════════════════════════════════════╝
    """)
    print(f"{Style.RESET_ALL}")
    
    # Initialize processor
    processor = ChiralBrandProcessor(args.config)
    
    # Execute command
    if args.command == 'process':
        processor.process_batch(args.input, args.output)
    
    elif args.command == 'preview':
        if not args.file:
            print(f"{Fore.RED}Error: --file argument required for preview mode")
            sys.exit(1)
        processor.preview_replacements(args.file)
    
    elif args.command == 'single':
        if not args.file:
            print(f"{Fore.RED}Error: --file argument required for single file processing")
            sys.exit(1)
        
        input_path = Path(args.file)
        output_path = Path(args.output) / processor.generate_output_filename(input_path.name)
        
        if processor.process_single_pdf(input_path, output_path):
            print(f"{Fore.GREEN}✓ Successfully processed: {output_path}")
        else:
            print(f"{Fore.RED}✗ Failed to process file")

if __name__ == "__main__":
    main()