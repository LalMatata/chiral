#!/usr/bin/env python3
"""
Extract Product Information from All Processed Documents
Creates comprehensive product database in markdown format
"""

import os
import re
from pathlib import Path
from datetime import datetime

def extract_specifications_from_text(text, product_name):
    """Extract structured product specifications from text"""
    
    spec_data = {
        'name': product_name,
        'weight': None,
        'payload': None,
        'speed': None,
        'battery': None,
        'ip_rating': None,
        'dimensions': None,
        'operating_temp': None,
        'climbing_angle': None,
        'communication': None,
        'sensors': None,
        'applications': [],
        'features': [],
        'pricing': None,
        'availability': None
    }
    
    # Extract weight
    weight_match = re.search(r'Weight[:\s]*(\d+(?:\.\d+)?)\s*kg', text, re.IGNORECASE)
    if weight_match:
        spec_data['weight'] = f"{weight_match.group(1)}kg"
    
    # Extract payload
    payload_match = re.search(r'Payload[:\s]*(\d+(?:\.\d+)?)\s*kg', text, re.IGNORECASE)
    if payload_match:
        spec_data['payload'] = f"{payload_match.group(1)}kg"
    
    # Extract speed
    speed_match = re.search(r'Speed[:\s]*(\d+(?:\.\d+)?)\s*m/s', text, re.IGNORECASE)
    if speed_match:
        spec_data['speed'] = f"{speed_match.group(1)} m/s"
    
    # Extract battery life
    battery_match = re.search(r'Battery[:\s]*(\d+(?:\-\d+)?)\s*hours?', text, re.IGNORECASE)
    if battery_match:
        spec_data['battery'] = f"{battery_match.group(1)} hours"
    
    # Extract IP rating
    ip_match = re.search(r'IP\s*(\d+)', text, re.IGNORECASE)
    if ip_match:
        spec_data['ip_rating'] = f"IP{ip_match.group(1)}"
    
    # Extract climbing angle
    climb_match = re.search(r'Climbing[:\s]*(\d+)°', text, re.IGNORECASE)
    if climb_match:
        spec_data['climbing_angle'] = f"{climb_match.group(1)}°"
    
    # Extract operating temperature
    temp_match = re.search(r'Temperature[:\s]*(-?\d+)°C\s*to\s*\+?(-?\d+)°C', text, re.IGNORECASE)
    if temp_match:
        spec_data['operating_temp'] = f"{temp_match.group(1)}°C to +{temp_match.group(2)}°C"
    
    # Extract communication
    comm_patterns = ['5G', '4G', 'WiFi', 'Ethernet', 'CAN bus', 'Bluetooth']
    found_comm = []
    for pattern in comm_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            found_comm.append(pattern)
    if found_comm:
        spec_data['communication'] = ', '.join(found_comm)
    
    # Extract features
    feature_section = re.search(r'Features?[:\s]*(.*?)(?:Applications?|Specifications?|Contact|$)', 
                               text, re.IGNORECASE | re.DOTALL)
    if feature_section:
        features_text = feature_section.group(1)
        feature_lines = [line.strip().lstrip('•-*').strip() 
                        for line in features_text.split('\n') 
                        if line.strip() and len(line.strip()) > 10]
        spec_data['features'] = feature_lines[:8]  # Limit to 8 features
    
    # Extract applications
    app_section = re.search(r'Applications?[:\s]*(.*?)(?:Features?|Contact|Specifications?|$)', 
                           text, re.IGNORECASE | re.DOTALL)
    if app_section:
        apps_text = app_section.group(1)
        app_lines = [line.strip().lstrip('•-*').strip() 
                    for line in apps_text.split('\n') 
                    if line.strip() and len(line.strip()) > 5]
        spec_data['applications'] = app_lines[:6]  # Limit to 6 applications
    
    return spec_data

def determine_product_category(product_name, specs):
    """Determine product category based on name and specifications"""
    
    name_lower = product_name.lower()
    
    if 'lite3' in name_lower:
        return 'flagship', 'Advanced quadruped robot for commercial and research applications'
    elif 'x20' in name_lower:
        return 'heavy-duty', 'Industrial-grade quadruped for heavy payload operations'
    elif 'mini' in name_lower:
        return 'educational', 'Compact quadruped designed for education and light applications'
    elif 'x30' in name_lower:
        return 'enterprise', 'Next-generation enterprise quadruped platform'
    elif 'lite2' in name_lower:
        return 'legacy', 'Previous generation quadruped (legacy support available)'
    elif 'j60' in name_lower:
        return 'component', 'High-performance actuator component for quadruped systems'
    else:
        return 'general', 'Quadruped robotics product'

def extract_all_product_info():
    """Extract product information from all processed files"""
    
    print("🔍 Extracting Product Information from All Documents")
    print("=" * 60)
    
    output_dir = Path("output")
    processed_files = list(output_dir.glob("Chiral_*.txt"))
    
    if not processed_files:
        print("❌ No processed files found")
        return None
    
    print(f"📁 Found {len(processed_files)} processed documents")
    
    products = {}
    
    for file_path in processed_files:
        print(f"📄 Processing: {file_path.name}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Determine product name from filename
            filename = file_path.stem
            if 'Lite3' in filename:
                product_name = "Chiral Lite3"
            elif 'X20' in filename:
                product_name = "Chiral X20"
            elif 'Mini' in filename:
                product_name = "Chiral Mini"
            elif 'X30' in filename:
                product_name = "Chiral X30"
            elif 'Lite2' in filename:
                product_name = "Chiral Lite2"
            elif 'J60' in filename:
                product_name = "Chiral J60Joint"
            else:
                product_name = filename.replace('Chiral_', '').replace('_', ' ')
            
            # Extract specifications
            specs = extract_specifications_from_text(content, product_name)
            category, description = determine_product_category(product_name, specs)
            specs['category'] = category
            specs['description'] = description
            specs['source_file'] = file_path.name
            
            # Store in products dict, avoiding duplicates
            if product_name not in products:
                products[product_name] = specs
            else:
                # Merge data if we have multiple sources
                for key, value in specs.items():
                    if value and not products[product_name].get(key):
                        products[product_name][key] = value
        
        except Exception as e:
            print(f"❌ Error processing {file_path.name}: {e}")
    
    print(f"✅ Extracted information for {len(products)} products")
    return products

def generate_markdown_database(products):
    """Generate comprehensive markdown product database"""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    md_content = f"""# CHIRAL Robotics Product Database

> **Generated**: {timestamp}  
> **Source**: CHIRAL Brand Processor  
> **Products**: {len(products)} quadruped robots and components  

This comprehensive product database contains all CHIRAL robotics products with detailed specifications, applications, and technical information. This data is optimized for RAG (Retrieval-Augmented Generation) systems and cross-functional use.

## 📋 Quick Reference

| Product | Category | Weight | Payload | Speed | Battery | Status |
|---------|----------|--------|---------|-------|---------|--------|
"""
    
    # Quick reference table
    for name, specs in products.items():
        md_content += f"| **{name}** | {specs.get('category', 'N/A').title()} | {specs.get('weight', 'N/A')} | {specs.get('payload', 'N/A')} | {specs.get('speed', 'N/A')} | {specs.get('battery', 'N/A')} | Active |\n"
    
    md_content += """
---

## 🤖 Product Catalog

"""
    
    # Detailed product sections
    for product_name, specs in products.items():
        category_emoji = {
            'flagship': '🚀',
            'heavy-duty': '💪',
            'educational': '🎓',
            'enterprise': '🏢',
            'legacy': '📦',
            'component': '⚙️',
            'general': '🤖'
        }.get(specs.get('category'), '🤖')
        
        md_content += f"""### {category_emoji} {product_name}

**Category**: {specs.get('category', 'General').title()}  
**Description**: {specs.get('description', 'Advanced quadruped robotics solution')}

#### Technical Specifications

"""
        
        # Core specifications
        spec_items = [
            ('Weight', specs.get('weight')),
            ('Payload Capacity', specs.get('payload')),
            ('Maximum Speed', specs.get('speed')),
            ('Battery Life', specs.get('battery')),
            ('IP Rating', specs.get('ip_rating')),
            ('Climbing Capability', specs.get('climbing_angle')),
            ('Operating Temperature', specs.get('operating_temp')),
            ('Communication', specs.get('communication'))
        ]
        
        for spec_name, spec_value in spec_items:
            if spec_value:
                md_content += f"- **{spec_name}**: {spec_value}\n"
        
        # Features
        if specs.get('features'):
            md_content += "\n#### Key Features\n\n"
            for feature in specs['features']:
                if feature.strip():
                    md_content += f"- {feature.strip()}\n"
        
        # Applications
        if specs.get('applications'):
            md_content += "\n#### Applications\n\n"
            for app in specs['applications']:
                if app.strip():
                    md_content += f"- {app.strip()}\n"
        
        md_content += f"\n*Source: {specs.get('source_file', 'Multiple sources')}*\n\n---\n\n"
    
    # Additional sections
    md_content += """## 🏢 Company Information

**Company Name**: CHIRAL Robotics  
**Website**: www.chiralrobotics.com  
**Contact Email**: info@chiralrobotics.com  
**Sales Email**: sales@chiralrobotics.com  
**Support Email**: support@chiralrobotics.com  

**Address**: [Address TBD]  
**Phone**: [Contact TBD]  

## 📊 Product Categories

### 🚀 Flagship Products
Advanced quadruped robots designed for commercial and research applications with cutting-edge features.

### 💪 Heavy-Duty Solutions  
Industrial-grade quadrupeds capable of heavy payload operations in demanding environments.

### 🎓 Educational Platforms
Compact, safe quadruped robots designed for educational institutions and research labs.

### 🏢 Enterprise Solutions
Next-generation quadruped platforms for large-scale enterprise deployments.

### ⚙️ Components & Actuators
High-performance components and actuators for custom robotics applications.

## 🔧 Technical Support

### Software Compatibility
- **ROS (Robot Operating System)** compatible
- **Python SDK** available
- **C++ SDK** available  
- **Machine Learning** integration support
- **Computer Vision** processing capabilities

### Development Resources
- Comprehensive API documentation
- Sample code and tutorials
- Developer community support
- Regular software updates

## 📈 Market Applications

### Industrial Applications
- Security and surveillance patrols
- Industrial facility inspection  
- Automated material transport
- Equipment monitoring and maintenance

### Research & Development
- Robotics research platforms
- AI and machine learning development
- Sensor integration testing
- Autonomous navigation research

### Educational Use
- STEM education programs
- Robotics engineering courses
- Research project platforms
- Technical skill development

### Commercial Services
- Entertainment and demonstrations
- Promotional activities
- Public engagement events
- Technology showcases

## 🛡️ Safety & Compliance

### Safety Features
- Emergency stop functionality
- Automatic fall detection and recovery
- Collision avoidance systems
- Safe mode operation
- Temperature monitoring
- Battery protection systems

### Quality Standards
- ISO 9001 certified manufacturing
- Rigorous quality control processes
- Comprehensive testing protocols
- International safety compliance

## 📞 Contact & Support

For product inquiries, technical support, or partnership opportunities:

- **General Inquiries**: info@chiralrobotics.com
- **Sales Team**: sales@chiralrobotics.com  
- **Technical Support**: support@chiralrobotics.com
- **Partnership Opportunities**: partnerships@chiralrobotics.com

### Regional Support
- **International Sales**: Available worldwide
- **Technical Support**: English language support
- **Documentation**: Multi-language resources available

---

## 📝 RAG System Integration Notes

This document is optimized for RAG (Retrieval-Augmented Generation) systems with:

- **Structured Data**: Clear product specifications and categories
- **Searchable Content**: Comprehensive feature and application lists  
- **Context Rich**: Detailed descriptions for accurate retrieval
- **Cross-Referenced**: Linked product categories and specifications
- **Update Ready**: Timestamp and source tracking for version control

### Query Optimization Keywords

**Product Names**: Chiral Lite3, Chiral X20, Chiral Mini, Chiral X30, Chiral Lite2, Chiral J60Joint

**Categories**: Flagship, Heavy-duty, Educational, Enterprise, Legacy, Component

**Applications**: Security, Industrial, Research, Educational, Commercial, Surveillance, Inspection

**Specifications**: Weight, Payload, Speed, Battery, IP Rating, Communication, Sensors

**Technical**: ROS, SDK, API, Machine Learning, Computer Vision, Autonomous Navigation

---

*Last Updated: {timestamp}*  
*Generated by: CHIRAL Brand Processor v1.0*  
*Document Type: Product Database for RAG Integration*
"""
    
    return md_content

def main():
    """Main extraction and generation function"""
    
    print("📚 CHIRAL Product Information Extractor")
    print("=" * 50)
    
    # Extract product information
    products = extract_all_product_info()
    
    if not products:
        print("❌ No product information extracted")
        return
    
    # Generate markdown database
    print(f"\n📝 Generating Markdown Database...")
    md_content = generate_markdown_database(products)
    
    # Save to file
    output_path = Path("CHIRAL_Product_Database.md")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    # Also save to project root for merging to master
    root_path = Path("../CHIRAL_Product_Database.md")
    with open(root_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"✅ Product database generated:")
    print(f"   📄 Local: {output_path}")
    print(f"   📄 Project: {root_path}")
    
    # Generate summary statistics
    print(f"\n📊 Database Statistics:")
    print(f"   🤖 Total Products: {len(products)}")
    
    categories = {}
    for product in products.values():
        cat = product.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"   📋 Categories:")
    for category, count in categories.items():
        print(f"      • {category.title()}: {count} products")
    
    print(f"   📏 Content Size: {len(md_content):,} characters")
    lines_count = len(md_content.split('\n'))
    print(f"   📝 Lines: {lines_count:,}")
    
    print(f"\n🎯 Ready for:")
    print(f"   • RAG system integration")
    print(f"   • Cross-functional sharing")
    print(f"   • Master branch merge")
    print(f"   • Documentation distribution")

if __name__ == "__main__":
    main()