#!/usr/bin/env python3
"""
Create real PDF files for testing without heavy dependencies
"""

def create_pdf_using_builtin():
    """Create PDF using available tools"""
    
    # Create HTML content that can be converted to PDF
    html_content = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DEEP Robotics - JueyingLite3 Product Datasheet</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background-color: #f0f0f0; padding: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #333; }
        .content { margin: 20px 0; }
        .specs table { border-collapse: collapse; width: 100%; }
        .specs th, .specs td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .specs th { background-color: #f2f2f2; }
        .footer { margin-top: 40px; padding: 20px; background-color: #f8f8f8; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">DEEP Robotics Co., Ltd.</div>
        <p>Advanced Quadruped Robotics Solutions</p>
        <p>Website: www.deeprobotics.cn | Email: info@deeprobotics.cn</p>
    </div>
    
    <h1>JueyingLite3 Quadruped Robot</h1>
    <p><strong>Product Datasheet</strong></p>
    
    <div class="content">
        <h2>Overview</h2>
        <p>The JueyingLite3 is DEEP Robotics' flagship quadruped robot designed for research, education, and commercial applications. Built by 云深处科技, this robot represents the cutting edge of autonomous mobility.</p>
        
        <h2>Technical Specifications</h2>
        <div class="specs">
            <table>
                <tr><th>Parameter</th><th>Value</th></tr>
                <tr><td>Weight</td><td>45kg</td></tr>
                <tr><td>Payload Capacity</td><td>20kg</td></tr>
                <tr><td>Maximum Speed</td><td>5 m/s</td></tr>
                <tr><td>Operating Time</td><td>2-4 hours</td></tr>
                <tr><td>Climbing Angle</td><td>30°</td></tr>
                <tr><td>IP Rating</td><td>IP65</td></tr>
                <tr><td>Communication</td><td>4G/5G, WiFi, Ethernet</td></tr>
            </table>
        </div>
        
        <h2>Key Features</h2>
        <ul>
            <li>Advanced AI-powered autonomous navigation</li>
            <li>Real-time obstacle detection and avoidance</li>
            <li>Remote control and monitoring via mobile app</li>
            <li>Modular design for easy customization</li>
            <li>Weather-resistant construction</li>
        </ul>
        
        <h2>Applications</h2>
        <ul>
            <li>Security and surveillance patrols</li>
            <li>Industrial inspection and monitoring</li>
            <li>Search and rescue operations</li>
            <li>Research and development platforms</li>
        </ul>
    </div>
    
    <div class="footer">
        <h3>Contact Information</h3>
        <p><strong>Company:</strong> 杭州云深处科技有限公司 (DEEP Robotics Co., Ltd.)</p>
        <p><strong>Address:</strong> 中国杭州, 浙江省杭州市西湖区</p>
        <p><strong>Phone:</strong> 0571-85073796</p>
        <p><strong>Email:</strong> sales@deeprobotics.cn</p>
        <p><strong>Website:</strong> www.deeprobotics.cn</p>
        
        <hr>
        <p><em>© 2024 DEEP Robotics. All rights reserved. Jueying is a trademark of 云深处科技.</em></p>
    </div>
</body>
</html>
"""
    
    # Save HTML file
    with open("input/JueyingLite3_Datasheet.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print("✅ Created HTML version: input/JueyingLite3_Datasheet.html")
    
    # Try to convert HTML to PDF using system tools
    import subprocess
    import os
    
    try:
        # Try using wkhtmltopdf if available
        result = subprocess.run([
            "wkhtmltopdf", 
            "input/JueyingLite3_Datasheet.html", 
            "input/JueyingLite3_Real.pdf"
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ Created PDF using wkhtmltopdf: input/JueyingLite3_Real.pdf")
            return "input/JueyingLite3_Real.pdf"
        else:
            print("❌ wkhtmltopdf failed:", result.stderr)
            
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("⚠️  wkhtmltopdf not available")
    
    # Try using system print to PDF (macOS)
    if os.system("which cupsfilter > /dev/null") == 0:
        try:
            result = subprocess.run([
                "cupsfilter",
                "input/JueyingLite3_Datasheet.html"
            ], stdout=open("input/JueyingLite3_Real.pdf", "wb"), 
            stderr=subprocess.PIPE, timeout=30)
            
            if os.path.exists("input/JueyingLite3_Real.pdf"):
                print("✅ Created PDF using cupsfilter: input/JueyingLite3_Real.pdf")
                return "input/JueyingLite3_Real.pdf"
            
        except Exception as e:
            print(f"❌ cupsfilter failed: {e}")
    
    print("⚠️  Could not create PDF automatically. HTML file created for manual conversion.")
    return "input/JueyingLite3_Datasheet.html"

def create_additional_sample_docs():
    """Create additional sample documents"""
    
    # JueyingX20 document
    x20_content = """
DEEP Robotics Product Specification
===================================

Model: JueyingX20 Heavy-Duty Quadruped Robot
Company: DEEP Robotics Co., Ltd. (云深处科技)
Website: www.deeprobotics.cn
Contact: info@deeprobotics.cn
Phone: 0571-85073796

SPECIFICATIONS:
- Weight: 110kg
- Payload: 50kg  
- Speed: 3.5 m/s
- Battery: 4-6 hours
- Climbing: 45° slopes
- Environment: IP67 rated

APPLICATIONS:
- Heavy industrial transport
- Construction site monitoring
- Military and defense
- Extreme environment operations

COMPANY INFO:
Manufacturer: 杭州云深处科技有限公司
Location: 中国杭州, 浙江省杭州市西湖区
Website: www.deeprobotics.cn
Sales: sales@deeprobotics.cn

© 2024 DEEP Robotics. Jueying technology by 云深处科技.
"""
    
    # JueyingMini document  
    mini_content = """
DEEP Robotics - JueyingMini Compact Robot
=========================================

PRODUCT: JueyingMini Educational Quadruped
COMPANY: DEEP Robotics (云深处科技)

Key Features:
- Lightweight design: 12kg
- Educational programming platform
- Safe for indoor use
- Easy maintenance

Technical Details:
- Payload: 5kg
- Speed: 2.5 m/s  
- Battery: 3-4 hours
- Programming: Python, C++, ROS

Contact DEEP Robotics:
- Website: www.deeprobotics.cn
- Email: edu@deeprobotics.cn
- Phone: 0571-85073796
- Address: 中国杭州

Developed by 杭州云深处科技有限公司
Visit www.deeprobotics.cn for more Jueying products
"""
    
    # Save additional documents
    with open("input/JueyingX20_Spec.txt", "w", encoding="utf-8") as f:
        f.write(x20_content)
    
    with open("input/JueyingMini_Educational.txt", "w", encoding="utf-8") as f:
        f.write(mini_content)
    
    print("✅ Created additional sample documents:")
    print("   - input/JueyingX20_Spec.txt")  
    print("   - input/JueyingMini_Educational.txt")

if __name__ == "__main__":
    print("🔧 Creating Real PDF and Sample Documents")
    print("=" * 50)
    
    # Create HTML/PDF document
    result = create_pdf_using_builtin()
    
    # Create additional sample documents
    create_additional_sample_docs()
    
    print("\n📁 Available files for processing:")
    import os
    for file in os.listdir("input"):
        print(f"   - {file}")
    
    print(f"\n💡 You can now run:")
    print(f"   python3 demo_processor.py  # Process all text files")
    if result.endswith('.pdf'):
        print(f"   python3 main.py single --file {result}  # Process PDF (requires dependencies)")