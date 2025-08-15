#!/usr/bin/env python3
"""
Create a sample PDF for testing the CHIRAL Brand Processor
"""

def create_sample_pdf_simple():
    """Create a simple text-based PDF without dependencies"""
    
    # Create a simple text file that simulates PDF content
    sample_content = """
DEEP Robotics Product Datasheet
===============================

Company: DEEP Robotics Co., Ltd.
Website: www.deeprobotics.cn
Email: info@deeprobotics.cn
Phone: 0571-85073796

Product: JueyingLite3 Quadruped Robot
=====================================

Specifications:
- Weight: 45kg
- Payload: 20kg
- Speed: 5 m/s
- Battery: 2-4 hours operation

Features:
- Advanced locomotion
- Autonomous navigation  
- Real-time obstacle avoidance
- Remote control capability

Company Information:
- Founded by 云深处科技
- Located in 杭州云深处科技有限公司
- Leading robotics innovation

Contact Information:
===================
Visit: www.deeprobotics.cn
Email: sales@deeprobotics.cn
Phone: 0571-85073796
Address: 中国杭州

Jueying Series Products:
- JueyingLite3
- Jueying X20
- Jueying Mini
"""
    
    # Save as text file for now (we'll process it as if it were PDF content)
    with open("input/sample_document.txt", "w", encoding="utf-8") as f:
        f.write(sample_content)
    
    print("✅ Created sample document: input/sample_document.txt")
    return "input/sample_document.txt"

def create_with_reportlab():
    """Try to create a real PDF using reportlab if available"""
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        pdf_path = "input/JueyingLite3_Sample.pdf"
        c = canvas.Canvas(pdf_path, pagesize=letter)
        
        # Title
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, 750, "DEEP Robotics Product Datasheet")
        
        # Company info
        c.setFont("Helvetica", 12)
        y = 700
        content = [
            "Company: DEEP Robotics Co., Ltd.",
            "Website: www.deeprobotics.cn", 
            "Email: info@deeprobotics.cn",
            "Phone: 0571-85073796",
            "",
            "Product: JueyingLite3 Quadruped Robot",
            "",
            "Specifications:",
            "• Weight: 45kg",
            "• Payload: 20kg", 
            "• Speed: 5 m/s",
            "• Battery: 2-4 hours operation",
            "",
            "Company: 云深处科技",
            "Location: 杭州云深处科技有限公司",
            "",
            "Contact: sales@deeprobotics.cn"
        ]
        
        for line in content:
            c.drawString(50, y, line)
            y -= 20
        
        c.save()
        print(f"✅ Created real PDF: {pdf_path}")
        return pdf_path
        
    except ImportError:
        print("❌ reportlab not available, using text file instead")
        return create_sample_pdf_simple()

if __name__ == "__main__":
    import os
    
    # Ensure input directory exists
    os.makedirs("input", exist_ok=True)
    
    # Try to create a real PDF, fall back to text file
    sample_file = create_with_reportlab()
    
    print(f"Sample file created: {sample_file}")
    print("You can now test the brand processor with this sample file.")