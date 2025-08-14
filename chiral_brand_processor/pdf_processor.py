"""
PDF Processing Module - Handles PDF manipulation and conversion
"""

import io
import os
import tempfile
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging
import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont
import pytesseract
from pdf2image import convert_from_path
import pdfplumber
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader

logger = logging.getLogger(__name__)

class PDFProcessor:
    """Handles PDF reading, modification, and writing operations"""
    
    def __init__(self):
        """Initialize PDF processor"""
        self.supported_formats = ['.pdf']
        self.temp_dir = tempfile.mkdtemp()
        self.setup_fonts()
    
    def setup_fonts(self):
        """Setup custom fonts for PDF generation"""
        try:
            # Register common fonts
            font_paths = {
                'Arial': '/System/Library/Fonts/Helvetica.ttc',
                'ArialBold': '/System/Library/Fonts/Helvetica.ttc',
            }
            
            for font_name, font_path in font_paths.items():
                if os.path.exists(font_path):
                    try:
                        pdfmetrics.registerFont(TTFont(font_name, font_path))
                    except:
                        pass
        except Exception as e:
            logger.warning(f"Could not register custom fonts: {e}")
    
    def load_pdf(self, pdf_path: Path) -> Dict[str, Any]:
        """Load and parse PDF file"""
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        pdf_data = {
            'path': pdf_path,
            'pages': [],
            'metadata': {},
            'images': [],
            'text_blocks': []
        }
        
        try:
            # Use PyMuPDF for comprehensive PDF handling
            doc = fitz.open(str(pdf_path))
            
            # Extract metadata
            pdf_data['metadata'] = doc.metadata
            pdf_data['page_count'] = len(doc)
            
            # Process each page
            for page_num, page in enumerate(doc):
                page_data = {
                    'number': page_num + 1,
                    'width': page.rect.width,
                    'height': page.rect.height,
                    'text': page.get_text(),
                    'blocks': [],
                    'images': []
                }
                
                # Extract text blocks with positions
                blocks = page.get_text("dict")
                for block in blocks.get("blocks", []):
                    if block.get("type") == 0:  # Text block
                        for line in block.get("lines", []):
                            for span in line.get("spans", []):
                                page_data['blocks'].append({
                                    'text': span.get("text", ""),
                                    'bbox': span.get("bbox"),
                                    'font': span.get("font"),
                                    'size': span.get("size"),
                                    'flags': span.get("flags"),
                                    'color': span.get("color")
                                })
                
                # Extract images
                image_list = page.get_images()
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_data = pix.tobytes("png")
                        page_data['images'].append({
                            'index': img_index,
                            'data': img_data,
                            'bbox': page.get_image_bbox(img)
                        })
                    pix = None
                
                pdf_data['pages'].append(page_data)
            
            doc.close()
            
        except Exception as e:
            logger.error(f"Error loading PDF: {e}")
            raise
        
        return pdf_data
    
    def save_pdf(self, pdf_data: Dict[str, Any], output_path: Path):
        """Save modified PDF data to file"""
        try:
            # Create new PDF document
            doc = fitz.open()
            
            for page_data in pdf_data['pages']:
                # Create new page with same dimensions
                page = doc.new_page(
                    width=page_data['width'],
                    height=page_data['height']
                )
                
                # Add text blocks
                for block in page_data['blocks']:
                    if block.get('text'):
                        # Insert text at specified position
                        page.insert_text(
                            point=(block['bbox'][0], block['bbox'][1]) if block.get('bbox') else (72, 72),
                            text=block['text'],
                            fontsize=block.get('size', 12),
                            fontname=block.get('font', 'helv'),
                            color=block.get('color', (0, 0, 0))
                        )
                
                # Add images
                for img_data in page_data.get('images', []):
                    if img_data.get('data'):
                        # Insert image
                        img_rect = img_data.get('bbox', fitz.Rect(0, 0, 100, 100))
                        page.insert_image(img_rect, stream=img_data['data'])
            
            # Save document
            doc.save(str(output_path), deflate=True, garbage=3)
            doc.close()
            
            logger.info(f"PDF saved successfully to {output_path}")
            
        except Exception as e:
            logger.error(f"Error saving PDF: {e}")
            raise
    
    def replace_logo(self, pdf_data: Dict[str, Any], logo_path: Path) -> Dict[str, Any]:
        """Replace existing logos with new CHIRAL logo"""
        try:
            # Load new logo
            if not logo_path.exists():
                logger.warning(f"Logo file not found: {logo_path}")
                return pdf_data
            
            logo_img = Image.open(logo_path)
            
            # Process each page
            for page_data in pdf_data['pages']:
                # Detect and replace logo areas
                # This is simplified - in production, you'd use more sophisticated logo detection
                images_to_replace = []
                
                for img_index, img_data in enumerate(page_data.get('images', [])):
                    bbox = img_data.get('bbox')
                    if bbox:
                        # Check if image is likely a logo (top area, reasonable size)
                        if bbox[1] < 150:  # Top 150 pixels
                            images_to_replace.append(img_index)
                
                # Replace detected logos
                for img_index in images_to_replace:
                    if img_index < len(page_data['images']):
                        # Convert new logo to appropriate size
                        old_bbox = page_data['images'][img_index].get('bbox')
                        if old_bbox:
                            width = old_bbox[2] - old_bbox[0]
                            height = old_bbox[3] - old_bbox[1]
                            
                            # Resize logo to fit
                            resized_logo = logo_img.resize(
                                (int(width), int(height)),
                                Image.Resampling.LANCZOS
                            )
                            
                            # Convert to bytes
                            img_byte_arr = io.BytesIO()
                            resized_logo.save(img_byte_arr, format='PNG')
                            
                            # Replace image data
                            page_data['images'][img_index]['data'] = img_byte_arr.getvalue()
            
            return pdf_data
            
        except Exception as e:
            logger.error(f"Error replacing logo: {e}")
            return pdf_data
    
    def extract_text_with_positions(self, pdf_path: Path) -> List[Dict]:
        """Extract text with position information for precise replacement"""
        text_elements = []
        
        try:
            with pdfplumber.open(str(pdf_path)) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    # Extract words with bounding boxes
                    words = page.extract_words(
                        x_tolerance=3,
                        y_tolerance=3,
                        keep_blank_chars=False
                    )
                    
                    for word in words:
                        text_elements.append({
                            'page': page_num + 1,
                            'text': word['text'],
                            'x0': word['x0'],
                            'y0': word['top'],
                            'x1': word['x1'],
                            'y1': word['bottom'],
                            'width': word['x1'] - word['x0'],
                            'height': word['bottom'] - word['top']
                        })
        
        except Exception as e:
            logger.error(f"Error extracting text positions: {e}")
        
        return text_elements
    
    def merge_pdfs(self, pdf_files: List[Path], output_path: Path):
        """Merge multiple PDF files into one"""
        try:
            pdf_writer = PdfWriter()
            
            for pdf_file in pdf_files:
                pdf_reader = PdfReader(str(pdf_file))
                for page in pdf_reader.pages:
                    pdf_writer.add_page(page)
            
            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)
            
            logger.info(f"Merged {len(pdf_files)} PDFs into {output_path}")
            
        except Exception as e:
            logger.error(f"Error merging PDFs: {e}")
            raise
    
    def add_watermark(self, pdf_path: Path, watermark_text: str, output_path: Path):
        """Add watermark to PDF pages"""
        try:
            # Create watermark PDF
            watermark_pdf = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False)
            c = canvas.Canvas(watermark_pdf.name, pagesize=A4)
            c.setFont("Helvetica", 50)
            c.setFillAlpha(0.1)
            c.saveState()
            c.translate(300, 400)
            c.rotate(45)
            c.drawCentredString(0, 0, watermark_text)
            c.restoreState()
            c.save()
            
            # Apply watermark
            pdf_reader = PdfReader(str(pdf_path))
            watermark_reader = PdfReader(watermark_pdf.name)
            pdf_writer = PdfWriter()
            
            watermark_page = watermark_reader.pages[0]
            
            for page in pdf_reader.pages:
                page.merge_page(watermark_page)
                pdf_writer.add_page(page)
            
            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)
            
            # Cleanup
            os.unlink(watermark_pdf.name)
            
            logger.info(f"Added watermark to {output_path}")
            
        except Exception as e:
            logger.error(f"Error adding watermark: {e}")
            raise
    
    def optimize_pdf(self, pdf_path: Path, output_path: Path, quality: str = 'standard'):
        """Optimize PDF file size and quality"""
        try:
            doc = fitz.open(str(pdf_path))
            
            # Set compression based on quality
            compression_settings = {
                'low': {'deflate': True, 'garbage': 4, 'clean': True},
                'standard': {'deflate': True, 'garbage': 3, 'clean': False},
                'high': {'deflate': False, 'garbage': 0, 'clean': False}
            }
            
            settings = compression_settings.get(quality, compression_settings['standard'])
            
            # Save with optimization
            doc.save(
                str(output_path),
                deflate=settings['deflate'],
                garbage=settings['garbage'],
                clean=settings['clean']
            )
            doc.close()
            
            # Report file size reduction
            original_size = pdf_path.stat().st_size
            new_size = output_path.stat().st_size
            reduction = (1 - new_size/original_size) * 100
            
            logger.info(f"PDF optimized: {reduction:.1f}% size reduction")
            
        except Exception as e:
            logger.error(f"Error optimizing PDF: {e}")
            raise
    
    def extract_images(self, pdf_path: Path, output_dir: Path):
        """Extract all images from PDF"""
        try:
            output_dir.mkdir(exist_ok=True)
            doc = fitz.open(str(pdf_path))
            
            image_count = 0
            for page_num, page in enumerate(doc):
                image_list = page.get_images()
                
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_path = output_dir / f"page{page_num+1}_img{img_index+1}.png"
                        pix.save(str(img_path))
                        image_count += 1
                    
                    pix = None
            
            doc.close()
            logger.info(f"Extracted {image_count} images from PDF")
            
        except Exception as e:
            logger.error(f"Error extracting images: {e}")
            raise
    
    def cleanup(self):
        """Clean up temporary files"""
        try:
            import shutil
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
        except Exception as e:
            logger.warning(f"Could not clean up temp files: {e}")