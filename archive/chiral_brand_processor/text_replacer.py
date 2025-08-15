"""
Text Replacement Module - Handles intelligent text substitution
"""

import re
import logging
from typing import Dict, List, Tuple, Any, Optional
from difflib import SequenceMatcher
import unicodedata

logger = logging.getLogger(__name__)

class TextReplacer:
    """Handles text replacement operations with context awareness"""
    
    def __init__(self, replacement_rules: Dict[str, str]):
        """Initialize text replacer with replacement rules"""
        self.rules = replacement_rules
        self.case_sensitive = False
        self.context_window = 50  # Characters around replacement for context
        
        # Compile regex patterns for efficiency
        self.patterns = self._compile_patterns()
        
        # Product naming patterns
        self.product_patterns = {
            'models': ['Lite3', 'Lite2', 'Mini', 'X20', 'X30', 'J60'],
            'prefixes_to_remove': ['Jueying', '绝影', 'JUEYING'],
            'new_prefix': 'Chiral'
        }
    
    def _compile_patterns(self) -> Dict[str, re.Pattern]:
        """Compile regex patterns for replacements"""
        patterns = {}
        
        for old_text, new_text in self.rules.items():
            # Create pattern with word boundaries where appropriate
            if old_text.replace(' ', '').isalnum():
                # For alphanumeric strings, use word boundaries
                pattern = re.compile(
                    r'\b' + re.escape(old_text) + r'\b',
                    re.IGNORECASE if not self.case_sensitive else 0
                )
            else:
                # For other strings (URLs, emails, etc.), exact match
                pattern = re.compile(
                    re.escape(old_text),
                    re.IGNORECASE if not self.case_sensitive else 0
                )
            
            patterns[old_text] = pattern
        
        return patterns
    
    def replace_all(self, pdf_data: Dict[str, Any]) -> Dict[str, Any]:
        """Replace all text in PDF data according to rules"""
        replaced_count = 0
        
        try:
            # Process each page
            for page_data in pdf_data['pages']:
                # Replace in full text
                if 'text' in page_data:
                    page_data['text'], count = self._replace_text(page_data['text'])
                    replaced_count += count
                
                # Replace in text blocks
                for block in page_data.get('blocks', []):
                    if 'text' in block:
                        block['text'], count = self._replace_text(block['text'])
                        replaced_count += count
            
            logger.info(f"Total replacements made: {replaced_count}")
            
        except Exception as e:
            logger.error(f"Error during text replacement: {e}")
        
        return pdf_data
    
    def _replace_text(self, text: str) -> Tuple[str, int]:
        """Replace text according to rules and return count"""
        if not text:
            return text, 0
        
        original_text = text
        replacement_count = 0
        
        # Apply each replacement rule
        for old_text, new_text in self.rules.items():
            pattern = self.patterns.get(old_text)
            if pattern:
                # Count replacements
                matches = pattern.findall(text)
                replacement_count += len(matches)
                
                # Perform replacement
                text = pattern.sub(new_text, text)
        
        # Handle product naming
        text = self._update_product_names(text)
        
        # Log significant changes
        if replacement_count > 0:
            logger.debug(f"Replaced {replacement_count} instances")
        
        return text, replacement_count
    
    def _update_product_names(self, text: str) -> str:
        """Update product naming according to strategy"""
        # Remove old prefixes
        for prefix in self.product_patterns['prefixes_to_remove']:
            # Create pattern for prefix followed by model
            for model in self.product_patterns['models']:
                old_pattern = f"{prefix}\\s*{model}"
                new_name = f"{self.product_patterns['new_prefix']} {model}"
                
                text = re.sub(
                    old_pattern,
                    new_name,
                    text,
                    flags=re.IGNORECASE
                )
        
        # Also handle standalone model names
        for model in self.product_patterns['models']:
            # Check if model appears without any prefix
            pattern = rf'\b(?<![\w\u4e00-\u9fff]){model}\b'
            if re.search(pattern, text):
                # Add Chiral prefix if not already present
                if not re.search(rf'\bChiral\s+{model}\b', text, re.IGNORECASE):
                    text = re.sub(
                        pattern,
                        f"{self.product_patterns['new_prefix']} {model}",
                        text
                    )
        
        return text
    
    def find_replacements(self, pdf_data: Dict[str, Any]) -> List[Tuple[str, str, str]]:
        """Find all potential replacements without applying them"""
        replacements = []
        
        try:
            # Search through all text
            all_text = ""
            
            for page_data in pdf_data['pages']:
                if 'text' in page_data:
                    all_text += page_data['text'] + "\n"
            
            # Find matches for each rule
            for old_text, new_text in self.rules.items():
                pattern = self.patterns.get(old_text)
                if pattern:
                    for match in pattern.finditer(all_text):
                        start = max(0, match.start() - self.context_window)
                        end = min(len(all_text), match.end() + self.context_window)
                        context = all_text[start:end]
                        
                        replacements.append((old_text, new_text, context))
        
        except Exception as e:
            logger.error(f"Error finding replacements: {e}")
        
        return replacements
    
    def remove_prefix(self, pdf_data: Dict[str, Any], prefix: str) -> Dict[str, Any]:
        """Remove specific prefix from product names"""
        pattern = re.compile(
            re.escape(prefix) + r'\s*',
            re.IGNORECASE
        )
        
        for page_data in pdf_data['pages']:
            if 'text' in page_data:
                page_data['text'] = pattern.sub('', page_data['text'])
            
            for block in page_data.get('blocks', []):
                if 'text' in block:
                    block['text'] = pattern.sub('', block['text'])
        
        return pdf_data
    
    def add_product_prefix(self, pdf_data: Dict[str, Any], prefix: str) -> Dict[str, Any]:
        """Add prefix to product model names"""
        for model in self.product_patterns['models']:
            # Pattern to find standalone model names
            pattern = re.compile(
                rf'\b(?<!{re.escape(prefix)}\s){model}\b',
                re.IGNORECASE
            )
            
            replacement = f"{prefix} {model}"
            
            for page_data in pdf_data['pages']:
                if 'text' in page_data:
                    page_data['text'] = pattern.sub(replacement, page_data['text'])
                
                for block in page_data.get('blocks', []):
                    if 'text' in block:
                        block['text'] = pattern.sub(replacement, block['text'])
        
        return pdf_data
    
    def smart_replace(self, text: str, old: str, new: str, preserve_case: bool = True) -> str:
        """Perform smart replacement preserving case when appropriate"""
        if not preserve_case:
            return text.replace(old, new)
        
        # Find all case variations
        pattern = re.compile(re.escape(old), re.IGNORECASE)
        
        def replace_match(match):
            matched_text = match.group()
            
            # Determine case pattern
            if matched_text.isupper():
                return new.upper()
            elif matched_text.islower():
                return new.lower()
            elif matched_text[0].isupper():
                return new[0].upper() + new[1:].lower()
            else:
                return new
        
        return pattern.sub(replace_match, text)
    
    def validate_replacements(self, original: str, modified: str) -> bool:
        """Validate that replacements maintain document integrity"""
        # Check that we haven't broken any URLs
        url_pattern = re.compile(r'https?://[^\s]+')
        original_urls = set(url_pattern.findall(original))
        modified_urls = set(url_pattern.findall(modified))
        
        # Allow URL changes only if they're in our replacement rules
        for orig_url in original_urls:
            if orig_url not in modified_urls:
                # Check if this was an intended replacement
                replaced = False
                for old, new in self.rules.items():
                    if old in orig_url:
                        replaced = True
                        break
                
                if not replaced:
                    logger.warning(f"Potentially broken URL: {orig_url}")
                    return False
        
        # Check email addresses
        email_pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
        original_emails = set(email_pattern.findall(original))
        modified_emails = set(email_pattern.findall(modified))
        
        for orig_email in original_emails:
            if orig_email not in modified_emails:
                # Check if this was an intended replacement
                replaced = False
                for old, new in self.rules.items():
                    if old in orig_email:
                        replaced = True
                        break
                
                if not replaced:
                    logger.warning(f"Potentially broken email: {orig_email}")
                    return False
        
        return True
    
    def handle_chinese_text(self, text: str) -> str:
        """Special handling for Chinese text replacements"""
        # Normalize Unicode for consistent matching
        text = unicodedata.normalize('NFC', text)
        
        # Apply Chinese-specific replacements
        chinese_rules = {
            '云深处科技': 'CHIRAL',
            '杭州云深处科技有限公司': 'Chiral Robotics',
            '绝影': '',  # Remove Jueying Chinese name
            '中国杭州': '[Address TBD]',
            '浙江省杭州市': '[Address TBD]'
        }
        
        for old, new in chinese_rules.items():
            text = text.replace(old, new)
        
        return text
    
    def get_replacement_stats(self, pdf_data: Dict[str, Any]) -> Dict[str, int]:
        """Get statistics about replacements to be made"""
        stats = {rule: 0 for rule in self.rules.keys()}
        
        # Count occurrences
        for page_data in pdf_data['pages']:
            text = page_data.get('text', '')
            
            for old_text in self.rules.keys():
                pattern = self.patterns.get(old_text)
                if pattern:
                    matches = pattern.findall(text)
                    stats[old_text] += len(matches)
        
        return stats