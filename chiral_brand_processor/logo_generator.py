"""
Logo Generation Module - Creates CHIRAL branding elements
"""

import os
import io
from pathlib import Path
from typing import Tuple, Optional, Dict, Any
import logging
from PIL import Image, ImageDraw, ImageFont
import numpy as np

logger = logging.getLogger(__name__)

class LogoGenerator:
    """Generates CHIRAL logos and branding elements"""
    
    def __init__(self, logo_settings: Dict[str, Any]):
        """Initialize logo generator with settings"""
        self.settings = logo_settings
        self.output_dir = Path("assets")
        self.output_dir.mkdir(exist_ok=True)
        
        # Default settings
        self.default_settings = {
            'font_family': 'Arial',
            'font_weight': 'bold',
            'color': '#1e3a5f',
            'background': 'transparent',
            'style': 'modern',
            'size': 'auto'
        }
        
        # Merge with provided settings
        self.settings = {**self.default_settings, **self.settings}
        
        # Load fonts
        self.fonts = self._load_fonts()
    
    def _load_fonts(self) -> Dict[str, str]:
        """Load available system fonts"""
        fonts = {}
        
        # Common font paths on different systems
        font_paths = [
            # macOS
            '/System/Library/Fonts/',
            '/Library/Fonts/',
            '~/Library/Fonts/',
            # Windows
            'C:/Windows/Fonts/',
            # Linux
            '/usr/share/fonts/',
            '/usr/local/share/fonts/',
            '~/.fonts/'
        ]
        
        # Font mappings
        font_files = {
            'Arial': ['Arial.ttf', 'arial.ttf', 'Helvetica.ttc'],
            'Arial Bold': ['Arial Bold.ttf', 'arialbd.ttf', 'Helvetica.ttc'],
            'Roboto': ['Roboto-Regular.ttf'],
            'Open Sans': ['OpenSans-Regular.ttf'],
            'Montserrat': ['Montserrat-Regular.ttf']
        }
        
        for font_name, filenames in font_files.items():
            for path in font_paths:
                path = Path(path).expanduser()
                if path.exists():
                    for filename in filenames:
                        font_file = path / filename
                        if font_file.exists():
                            fonts[font_name] = str(font_file)
                            break
                    if font_name in fonts:
                        break
        
        logger.info(f"Loaded {len(fonts)} fonts")
        return fonts
    
    def generate_logo(self, size: Tuple[int, int] = (300, 100)) -> Path:
        """Generate CHIRAL logo with specified size"""
        try:
            # Determine size
            if self.settings['size'] == 'auto':
                width, height = size
            else:
                width, height = self.settings['size']
            
            # Create image
            if self.settings['background'] == 'transparent':
                img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
            else:
                img = Image.new('RGB', (width, height), self.settings['background'])
            
            draw = ImageDraw.Draw(img)
            
            # Load font
            font = self._get_font(int(height * 0.6))  # Font size is 60% of height
            
            # Get text color
            color = self._hex_to_rgb(self.settings['color'])
            
            # Draw text
            text = "CHIRAL"
            
            # Get text bounding box
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Center text
            x = (width - text_width) // 2
            y = (height - text_height) // 2
            
            # Apply style-specific modifications
            if self.settings['style'] == 'modern':
                self._draw_modern_logo(draw, text, x, y, font, color, width, height)
            elif self.settings['style'] == 'tech':
                self._draw_tech_logo(draw, text, x, y, font, color, width, height)
            elif self.settings['style'] == 'minimal':
                self._draw_minimal_logo(draw, text, x, y, font, color, width, height)
            else:
                draw.text((x, y), text, fill=color, font=font)
            
            # Save logo
            logo_path = self.output_dir / "chiral_logo.png"
            img.save(logo_path, format='PNG', optimize=True)
            
            logger.info(f"Logo generated: {logo_path}")
            return logo_path
            
        except Exception as e:
            logger.error(f"Error generating logo: {e}")
            # Generate fallback logo
            return self._generate_fallback_logo(size)
    
    def _draw_modern_logo(self, draw, text, x, y, font, color, width, height):
        """Draw modern style logo with gradient effect"""
        # Create gradient effect by drawing multiple layers
        for i in range(3):
            offset_color = self._adjust_color_brightness(color, 1 - i * 0.1)
            draw.text((x + i, y + i), text, fill=offset_color, font=font)
        
        # Add subtle line accent
        line_y = y + height // 2
        draw.line([(x - 20, line_y), (x - 5, line_y)], fill=color, width=3)
        draw.line([(x + width // 2 + 50, line_y), (x + width // 2 + 65, line_y)], fill=color, width=3)
    
    def _draw_tech_logo(self, draw, text, x, y, font, color, width, height):
        """Draw tech style logo with geometric elements"""
        draw.text((x, y), text, fill=color, font=font)
        
        # Add geometric elements
        # Small squares
        square_size = 8
        for i in range(3):
            square_x = x - 30 + i * 12
            square_y = y + height // 4
            draw.rectangle(
                [(square_x, square_y), (square_x + square_size, square_y + square_size)],
                fill=color
            )
        
        # Circuit-like lines
        draw.line([(x - 15, y + height // 2), (x - 5, y + height // 2)], fill=color, width=2)
        draw.line([(x - 10, y + height // 2 - 5), (x - 10, y + height // 2 + 5)], fill=color, width=2)
    
    def _draw_minimal_logo(self, draw, text, x, y, font, color, width, height):
        """Draw minimal style logo"""
        draw.text((x, y), text, fill=color, font=font)
        
        # Add simple underline
        line_width = len(text) * 20  # Approximate text width
        draw.line([(x, y + height + 5), (x + line_width, y + height + 5)], fill=color, width=2)
    
    def _get_font(self, size: int) -> ImageFont.ImageFont:
        """Get font object for specified size"""
        font_name = f"{self.settings['font_family']} {self.settings['font_weight']}"
        
        # Try to load specified font
        if font_name in self.fonts:
            try:
                return ImageFont.truetype(self.fonts[font_name], size)
            except:
                pass
        
        # Try base font name
        if self.settings['font_family'] in self.fonts:
            try:
                return ImageFont.truetype(self.fonts[self.settings['font_family']], size)
            except:
                pass
        
        # Try any available font
        for font_path in self.fonts.values():
            try:
                return ImageFont.truetype(font_path, size)
            except:
                continue
        
        # Fall back to default font
        try:
            return ImageFont.load_default()
        except:
            return ImageFont.load_default()
    
    def _hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def _adjust_color_brightness(self, rgb_color: Tuple[int, int, int], factor: float) -> Tuple[int, int, int]:
        """Adjust RGB color brightness by factor"""
        return tuple(min(255, max(0, int(c * factor))) for c in rgb_color)
    
    def _generate_fallback_logo(self, size: Tuple[int, int]) -> Path:
        """Generate simple fallback logo if main generation fails"""
        try:
            width, height = size
            img = Image.new('RGB', (width, height), 'white')
            draw = ImageDraw.Draw(img)
            
            # Use default font
            font = ImageFont.load_default()
            
            # Draw simple text
            text = "CHIRAL"
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            x = (width - text_width) // 2
            y = (height - text_height) // 2
            
            draw.text((x, y), text, fill=(30, 58, 95), font=font)  # Dark blue
            
            # Save fallback logo
            logo_path = self.output_dir / "chiral_logo_fallback.png"
            img.save(logo_path, format='PNG')
            
            logger.info(f"Fallback logo generated: {logo_path}")
            return logo_path
            
        except Exception as e:
            logger.error(f"Error generating fallback logo: {e}")
            raise
    
    def generate_letterhead(self, size: Tuple[int, int] = (2480, 3508)) -> Path:
        """Generate CHIRAL letterhead template (A4 size at 300 DPI)"""
        try:
            width, height = size
            img = Image.new('RGB', (width, height), 'white')
            draw = ImageDraw.Draw(img)
            
            # Header
            header_height = 200
            header_color = self._hex_to_rgb(self.settings['color'])
            draw.rectangle([(0, 0), (width, header_height)], fill=header_color)
            
            # Logo in header
            logo_font = self._get_font(80)
            logo_text = "CHIRAL"
            draw.text((50, 60), logo_text, fill=(255, 255, 255), font=logo_font)
            
            # Tagline
            tagline_font = self._get_font(24)
            tagline = "Advanced Robotics Solutions"
            draw.text((50, 140), tagline, fill=(255, 255, 255), font=tagline_font)
            
            # Footer
            footer_y = height - 150
            footer_font = self._get_font(20)
            
            # Contact info
            contact_lines = [
                "www.chiralrobotics.com",
                "info@chiralrobotics.com",
                "[Address TBD]"
            ]
            
            for i, line in enumerate(contact_lines):
                draw.text((50, footer_y + i * 30), line, fill=header_color, font=footer_font)
            
            # Save letterhead
            letterhead_path = self.output_dir / "chiral_letterhead.png"
            img.save(letterhead_path, format='PNG', dpi=(300, 300))
            
            logger.info(f"Letterhead generated: {letterhead_path}")
            return letterhead_path
            
        except Exception as e:
            logger.error(f"Error generating letterhead: {e}")
            raise
    
    def generate_favicon(self) -> Path:
        """Generate favicon for web use"""
        try:
            # Create small logo
            img = Image.new('RGBA', (64, 64), (255, 255, 255, 0))
            draw = ImageDraw.Draw(img)
            
            # Draw simplified logo
            font = self._get_font(20)
            color = self._hex_to_rgb(self.settings['color'])
            
            # Draw 'C' for CHIRAL
            draw.text((20, 22), 'C', fill=color, font=font)
            
            # Add small accent
            draw.ellipse([(45, 25), (55, 35)], fill=color)
            
            # Save as ICO
            favicon_path = self.output_dir / "favicon.ico"
            img.save(favicon_path, format='ICO', sizes=[(64, 64), (32, 32), (16, 16)])
            
            logger.info(f"Favicon generated: {favicon_path}")
            return favicon_path
            
        except Exception as e:
            logger.error(f"Error generating favicon: {e}")
            # Generate PNG fallback
            favicon_path = self.output_dir / "favicon.png"
            img.save(favicon_path, format='PNG')
            return favicon_path
    
    def create_brand_kit(self) -> Dict[str, Path]:
        """Create complete brand kit with various logo sizes and formats"""
        brand_kit = {}
        
        # Standard sizes
        sizes = {
            'logo_small': (150, 50),
            'logo_medium': (300, 100),
            'logo_large': (600, 200),
            'logo_square': (200, 200),
            'banner': (800, 200)
        }
        
        try:
            for size_name, dimensions in sizes.items():
                logo_path = self.generate_logo(dimensions)
                
                # Create version with different name
                new_path = self.output_dir / f"chiral_{size_name}.png"
                os.rename(logo_path, new_path)
                brand_kit[size_name] = new_path
            
            # Add special items
            brand_kit['letterhead'] = self.generate_letterhead()
            brand_kit['favicon'] = self.generate_favicon()
            
            # Create variations
            original_bg = self.settings['background']
            
            # White background version
            self.settings['background'] = 'white'
            brand_kit['logo_white_bg'] = self.generate_logo((300, 100))
            
            # Dark background version
            self.settings['background'] = '#2c3e50'
            self.settings['color'] = '#ffffff'
            brand_kit['logo_dark_bg'] = self.generate_logo((300, 100))
            
            # Restore original settings
            self.settings['background'] = original_bg
            self.settings['color'] = '#1e3a5f'
            
            logger.info(f"Brand kit created with {len(brand_kit)} items")
            return brand_kit
            
        except Exception as e:
            logger.error(f"Error creating brand kit: {e}")
            return {}
    
    def optimize_for_pdf(self, logo_path: Path, target_size: Tuple[int, int]) -> Path:
        """Optimize logo for PDF insertion"""
        try:
            # Load and resize logo
            img = Image.open(logo_path)
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Convert to RGB if necessary (for PDF compatibility)
            if img.mode == 'RGBA':
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Save optimized version
            optimized_path = self.output_dir / f"logo_pdf_optimized.png"
            img.save(optimized_path, format='PNG', optimize=True)
            
            return optimized_path
            
        except Exception as e:
            logger.error(f"Error optimizing logo for PDF: {e}")
            return logo_path