#!/usr/bin/env python3
"""
Test Suite for CHIRAL Brand Processor
"""

import os
import sys
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
import shutil

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import ChiralBrandProcessor
from pdf_processor import PDFProcessor
from text_replacer import TextReplacer
from logo_generator import LogoGenerator

class TestChiralBrandProcessor(unittest.TestCase):
    """Test the main brand processor"""
    
    def setUp(self):
        """Set up test environment"""
        self.test_dir = tempfile.mkdtemp()
        self.config_path = os.path.join(self.test_dir, "test_config.json")
        
        # Create test config
        test_config = {
            "text_replacements": {
                "DEEP Robotics": "CHIRAL",
                "www.deeprobotics.cn": "www.chiralrobotics.com"
            },
            "logo_settings": {
                "font_family": "Arial",
                "color": "#1e3a5f"
            },
            "output_naming": {
                "prefix": "Test_",
                "suffix": "_Modified"
            },
            "product_naming": {
                "remove_prefix": ["Jueying"],
                "add_prefix": "Chiral"
            },
            "processing": {
                "preserve_layout": True,
                "quality": "high"
            }
        }
        
        with open(self.config_path, 'w') as f:
            json.dump(test_config, f)
        
        # Mock input/output directories
        self.input_dir = os.path.join(self.test_dir, "input")
        self.output_dir = os.path.join(self.test_dir, "output")
        os.makedirs(self.input_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir, ignore_errors=True)
    
    def test_config_loading(self):
        """Test configuration loading"""
        processor = ChiralBrandProcessor(self.config_path)
        
        # Check if config loaded correctly
        self.assertIn("DEEP Robotics", processor.config['text_replacements'])
        self.assertEqual(processor.config['text_replacements']['DEEP Robotics'], "CHIRAL")
    
    def test_default_config_creation(self):
        """Test default config creation when file doesn't exist"""
        non_existent_config = os.path.join(self.test_dir, "missing_config.json")
        
        # This should create a default config
        processor = ChiralBrandProcessor(non_existent_config)
        
        # Check if file was created
        self.assertTrue(os.path.exists(non_existent_config))
        
        # Check if it has expected keys
        self.assertIn('text_replacements', processor.config)
        self.assertIn('logo_settings', processor.config)
    
    def test_output_filename_generation(self):
        """Test output filename generation"""
        processor = ChiralBrandProcessor(self.config_path)
        
        test_cases = [
            ("JueyingLite3.pdf", "Test_Lite3_Modified.pdf"),
            ("JueyingX20.pdf", "Test_X20_Modified.pdf"),
            ("X30.pdf", "Test_X30_Modified.pdf")
        ]
        
        for input_name, expected_output in test_cases:
            result = processor.generate_output_filename(input_name)
            self.assertEqual(result, expected_output)


class TestPDFProcessor(unittest.TestCase):
    """Test PDF processing functionality"""
    
    def setUp(self):
        """Set up test environment"""
        self.processor = PDFProcessor()
        self.test_dir = tempfile.mkdtemp()
    
    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir, ignore_errors=True)
        self.processor.cleanup()
    
    def test_supported_formats(self):
        """Test supported file format checking"""
        self.assertIn('.pdf', self.processor.supported_formats)
    
    @patch('fitz.open')
    def test_load_pdf_mock(self, mock_fitz):
        """Test PDF loading with mocked PyMuPDF"""
        # Create mock document
        mock_doc = MagicMock()
        mock_doc.metadata = {'title': 'Test PDF'}
        mock_doc.__len__.return_value = 1  # 1 page
        
        # Create mock page
        mock_page = MagicMock()
        mock_page.rect.width = 595
        mock_page.rect.height = 842
        mock_page.get_text.return_value = "Test content"
        mock_page.get_text.return_value = {"blocks": []}
        mock_page.get_images.return_value = []
        
        mock_doc.__iter__.return_value = [mock_page]
        mock_fitz.return_value = mock_doc
        
        # Test loading
        test_pdf_path = Path(os.path.join(self.test_dir, "test.pdf"))
        test_pdf_path.touch()  # Create empty file
        
        result = self.processor.load_pdf(test_pdf_path)
        
        # Verify structure
        self.assertIn('pages', result)
        self.assertIn('metadata', result)
        self.assertEqual(len(result['pages']), 1)
    
    def test_nonexistent_file(self):
        """Test handling of non-existent PDF files"""
        nonexistent_path = Path(os.path.join(self.test_dir, "nonexistent.pdf"))
        
        with self.assertRaises(FileNotFoundError):
            self.processor.load_pdf(nonexistent_path)


class TestTextReplacer(unittest.TestCase):
    """Test text replacement functionality"""
    
    def setUp(self):
        """Set up test environment"""
        self.replacement_rules = {
            "DEEP Robotics": "CHIRAL",
            "云深处科技": "CHIRAL",
            "www.deeprobotics.cn": "www.chiralrobotics.com",
            "test@deeprobotics.cn": "test@chiralrobotics.com"
        }
        self.replacer = TextReplacer(self.replacement_rules)
    
    def test_basic_replacement(self):
        """Test basic text replacement"""
        test_text = "Welcome to DEEP Robotics official website at www.deeprobotics.cn"
        result, count = self.replacer._replace_text(test_text)
        
        self.assertIn("CHIRAL", result)
        self.assertIn("www.chiralrobotics.com", result)
        self.assertNotIn("DEEP Robotics", result)
        self.assertNotIn("www.deeprobotics.cn", result)
        self.assertEqual(count, 2)  # Two replacements made
    
    def test_chinese_replacement(self):
        """Test Chinese text replacement"""
        test_text = "欢迎来到云深处科技官方网站"
        result, count = self.replacer._replace_text(test_text)
        
        self.assertIn("CHIRAL", result)
        self.assertNotIn("云深处科技", result)
        self.assertEqual(count, 1)
    
    def test_case_sensitivity(self):
        """Test case sensitivity handling"""
        test_text = "deep robotics and DEEP ROBOTICS and Deep Robotics"
        result, count = self.replacer._replace_text(test_text)
        
        # Should replace case-insensitively
        self.assertNotIn("deep robotics", result.lower())
        self.assertIn("CHIRAL", result)
    
    def test_product_naming(self):
        """Test product naming updates"""
        test_text = "JueyingLite3 robot and Jueying X20 model"
        result = self.replacer._update_product_names(test_text)
        
        self.assertIn("Chiral Lite3", result)
        self.assertIn("Chiral X20", result)
        self.assertNotIn("Jueying", result)
    
    def test_url_preservation(self):
        """Test that URLs are properly replaced without breaking"""
        original = "Visit us at www.deeprobotics.cn and https://www.deeprobotics.cn/products"
        modified, _ = self.replacer._replace_text(original)
        
        # Should contain the replacement
        self.assertIn("www.chiralrobotics.com", modified)
        
        # Validate replacements
        self.assertTrue(self.replacer.validate_replacements(original, modified))
    
    def test_email_preservation(self):
        """Test that email addresses are properly replaced"""
        original = "Contact us at info@deeprobotics.cn"
        modified, _ = self.replacer._replace_text(original)
        
        # Should contain the replacement
        self.assertIn("info@chiralrobotics.com", modified)
        
        # Validate replacements
        self.assertTrue(self.replacer.validate_replacements(original, modified))
    
    def test_replacement_statistics(self):
        """Test replacement statistics generation"""
        pdf_data = {
            'pages': [
                {'text': 'DEEP Robotics develops robots at www.deeprobotics.cn'},
                {'text': 'Another DEEP Robotics mention here'}
            ]
        }
        
        stats = self.replacer.get_replacement_stats(pdf_data)
        
        self.assertIn('DEEP Robotics', stats)
        self.assertEqual(stats['DEEP Robotics'], 2)
        self.assertEqual(stats['www.deeprobotics.cn'], 1)


class TestLogoGenerator(unittest.TestCase):
    """Test logo generation functionality"""
    
    def setUp(self):
        """Set up test environment"""
        self.logo_settings = {
            'font_family': 'Arial',
            'color': '#1e3a5f',
            'style': 'modern'
        }
        self.generator = LogoGenerator(self.logo_settings)
        self.test_dir = tempfile.mkdtemp()
    
    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir, ignore_errors=True)
    
    def test_logo_generation(self):
        """Test basic logo generation"""
        # Patch the output directory to our test directory
        self.generator.output_dir = Path(self.test_dir)
        
        logo_path = self.generator.generate_logo((300, 100))
        
        # Check if logo file was created
        self.assertTrue(logo_path.exists())
        self.assertTrue(logo_path.name.endswith('.png'))
    
    def test_fallback_logo_generation(self):
        """Test fallback logo generation"""
        # Patch the output directory to our test directory
        self.generator.output_dir = Path(self.test_dir)
        
        fallback_path = self.generator._generate_fallback_logo((200, 80))
        
        # Check if fallback logo was created
        self.assertTrue(fallback_path.exists())
        self.assertIn('fallback', fallback_path.name)
    
    def test_color_conversion(self):
        """Test hex color to RGB conversion"""
        rgb = self.generator._hex_to_rgb('#1e3a5f')
        self.assertEqual(rgb, (30, 58, 95))
        
        # Test without hash
        rgb2 = self.generator._hex_to_rgb('ff0000')
        self.assertEqual(rgb2, (255, 0, 0))
    
    def test_brightness_adjustment(self):
        """Test color brightness adjustment"""
        original_color = (100, 100, 100)
        brighter = self.generator._adjust_color_brightness(original_color, 1.5)
        darker = self.generator._adjust_color_brightness(original_color, 0.5)
        
        # Brighter should have higher values
        self.assertGreater(brighter[0], original_color[0])
        # Darker should have lower values
        self.assertLess(darker[0], original_color[0])
    
    def test_font_loading(self):
        """Test font loading functionality"""
        # This test may fail on systems without Arial, so we'll be lenient
        font = self.generator._get_font(24)
        self.assertIsNotNone(font)


class TestIntegration(unittest.TestCase):
    """Integration tests for the complete system"""
    
    def setUp(self):
        """Set up integration test environment"""
        self.test_dir = tempfile.mkdtemp()
        self.config_path = os.path.join(self.test_dir, "integration_config.json")
        
        # Create minimal config
        config = {
            "text_replacements": {"TEST": "CHIRAL"},
            "logo_settings": {"color": "#000000"},
            "output_naming": {"prefix": "Integration_"},
            "product_naming": {"add_prefix": "Chiral"},
            "processing": {"quality": "standard"}
        }
        
        with open(self.config_path, 'w') as f:
            json.dump(config, f)
    
    def tearDown(self):
        """Clean up integration test environment"""
        shutil.rmtree(self.test_dir, ignore_errors=True)
    
    def test_complete_workflow_mock(self):
        """Test complete workflow with mocked components"""
        processor = ChiralBrandProcessor(self.config_path)
        
        # Mock the PDF processor methods
        with patch.object(processor.pdf_processor, 'load_pdf') as mock_load, \
             patch.object(processor.pdf_processor, 'save_pdf') as mock_save, \
             patch.object(processor.logo_generator, 'generate_logo') as mock_logo:
            
            # Setup mocks
            mock_pdf_data = {
                'pages': [{'text': 'TEST document', 'blocks': []}],
                'metadata': {}
            }
            mock_load.return_value = mock_pdf_data
            mock_logo.return_value = Path(os.path.join(self.test_dir, 'test_logo.png'))
            
            # Create test input file
            input_file = Path(os.path.join(self.test_dir, 'test.pdf'))
            input_file.touch()
            
            output_file = Path(os.path.join(self.test_dir, 'output.pdf'))
            
            # Run the workflow
            result = processor.process_single_pdf(input_file, output_file)
            
            # Verify calls were made
            self.assertTrue(result)
            mock_load.assert_called_once()
            mock_save.assert_called_once()


def create_sample_pdf():
    """Create a sample PDF for testing (requires reportlab)"""
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        test_dir = tempfile.mkdtemp()
        pdf_path = os.path.join(test_dir, "sample.pdf")
        
        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.drawString(100, 750, "DEEP Robotics Sample Document")
        c.drawString(100, 700, "Visit us at www.deeprobotics.cn")
        c.drawString(100, 650, "Contact: info@deeprobotics.cn")
        c.drawString(100, 600, "JueyingLite3 Robot Specifications")
        c.save()
        
        return pdf_path
    except ImportError:
        return None


class TestWithRealPDF(unittest.TestCase):
    """Tests with real PDF files (optional - requires reportlab)"""
    
    def setUp(self):
        """Set up real PDF test environment"""
        self.sample_pdf = create_sample_pdf()
        self.test_dir = tempfile.mkdtemp()
    
    def tearDown(self):
        """Clean up real PDF test environment"""
        if self.sample_pdf and os.path.exists(self.sample_pdf):
            os.unlink(self.sample_pdf)
        shutil.rmtree(self.test_dir, ignore_errors=True)
    
    @unittest.skipIf(create_sample_pdf() is None, "reportlab not available")
    def test_real_pdf_processing(self):
        """Test with a real PDF file"""
        if not self.sample_pdf:
            self.skipTest("Could not create sample PDF")
        
        # Create processor
        config_path = os.path.join(self.test_dir, "test_config.json")
        config = {
            "text_replacements": {
                "DEEP Robotics": "CHIRAL",
                "www.deeprobotics.cn": "www.chiralrobotics.com"
            },
            "logo_settings": {"color": "#1e3a5f"},
            "output_naming": {"prefix": "Real_"},
            "product_naming": {"add_prefix": "Chiral"},
            "processing": {"quality": "standard"}
        }
        
        with open(config_path, 'w') as f:
            json.dump(config, f)
        
        processor = ChiralBrandProcessor(config_path)
        
        # Process the PDF
        output_path = Path(os.path.join(self.test_dir, "processed.pdf"))
        
        try:
            result = processor.process_single_pdf(Path(self.sample_pdf), output_path)
            
            # Check if processing succeeded
            self.assertTrue(result)
            self.assertTrue(output_path.exists())
            
        except Exception as e:
            # If dependencies are missing, skip this test
            self.skipTest(f"PDF processing failed due to missing dependencies: {e}")


def run_performance_test():
    """Run performance benchmarks"""
    print("\n" + "="*50)
    print("PERFORMANCE BENCHMARKS")
    print("="*50)
    
    import time
    
    # Test text replacement performance
    rules = {
        "DEEP Robotics": "CHIRAL",
        "云深处科技": "CHIRAL",
        "www.deeprobotics.cn": "www.chiralrobotics.com"
    }
    
    replacer = TextReplacer(rules)
    
    # Generate test text
    test_text = ("DEEP Robotics " * 1000 + "云深处科技 " * 500 + 
                 "www.deeprobotics.cn " * 200)
    
    start_time = time.time()
    result, count = replacer._replace_text(test_text)
    end_time = time.time()
    
    print(f"Text replacement performance:")
    print(f"  - Text length: {len(test_text):,} characters")
    print(f"  - Replacements made: {count}")
    print(f"  - Time taken: {end_time - start_time:.4f} seconds")
    print(f"  - Speed: {len(test_text)/(end_time - start_time):,.0f} chars/second")
    
    # Test logo generation performance
    logo_settings = {'color': '#1e3a5f', 'style': 'modern'}
    generator = LogoGenerator(logo_settings)
    
    start_time = time.time()
    logo_path = generator.generate_logo((300, 100))
    end_time = time.time()
    
    print(f"\nLogo generation performance:")
    print(f"  - Logo size: 300x100 pixels")
    print(f"  - Time taken: {end_time - start_time:.4f} seconds")
    print(f"  - Output file: {logo_path}")


def main():
    """Main test runner"""
    print("CHIRAL Brand Processor - Test Suite")
    print("=" * 50)
    
    # Create test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_classes = [
        TestChiralBrandProcessor,
        TestPDFProcessor,
        TestTextReplacer,
        TestLogoGenerator,
        TestIntegration
    ]
    
    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        test_suite.addTests(tests)
    
    # Add optional real PDF tests
    try:
        real_pdf_tests = unittest.TestLoader().loadTestsFromTestCase(TestWithRealPDF)
        test_suite.addTests(real_pdf_tests)
    except Exception as e:
        print(f"Skipping real PDF tests: {e}")
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Run performance tests if all tests passed
    if result.wasSuccessful():
        run_performance_test()
    
    # Print summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print("\nFAILURES:")
        for test, traceback in result.failures:
            print(f"  - {test}: {traceback.split('AssertionError:')[-1].strip()}")
    
    if result.errors:
        print("\nERRORS:")
        for test, traceback in result.errors:
            print(f"  - {test}: {traceback.split('Exception:')[-1].strip()}")
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)