import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Zap, Shield, Settings, Wrench } from 'lucide-react'

const Downloads = () => {
  const productDatasheets = [
    {
      title: 'Lite3 Series',
      description: 'Versatile research platform with advanced mobility and SDK support',
      filename: 'Chiral_Lite3_Datasheet.pdf',
      icon: Settings,
      features: ['12kg Weight', '40° Slope', 'SDK Included', 'Research Platform'],
      fileSize: '6.9 MB'
    },
    {
      title: 'X20 Series', 
      description: 'Industrial patrol and inspection specialist with exceptional mobility',
      filename: 'Chiral_X20_Datasheet.pdf',
      icon: Shield,
      features: ['20kg Payload', 'IP66 Protection', '15km Range', 'All-Terrain'],
      fileSize: '4.9 MB'
    },
    {
      title: 'X30 Series',
      description: 'Industrial flagship engineered for demanding operational environments',
      filename: 'Chiral_X30_Datasheet.pdf', 
      icon: Zap,
      features: ['IP67 Protection', '4m/s Max Speed', '2.5-4h Endurance', '10km Range'],
      fileSize: '593 KB'
    },
    {
      title: 'Lite2 Series',
      description: 'Next-generation agile intelligent robot dog for research and development',
      filename: 'Chiral_Lite2_Datasheet.pdf',
      icon: Settings,
      features: ['Enhanced Agility', 'Intelligent Interaction', 'Modular Design', 'SDK Support'],
      fileSize: '1.3 MB'
    },
    {
      title: 'Mini Series',
      description: 'Compact intelligent quadruped robot for education and research',
      filename: 'Chiral_Mini_Datasheet.pdf',
      icon: Settings,
      features: ['Compact Size', 'Educational Focus', 'Easy Operation', 'Affordable'],
      fileSize: '1.2 MB'
    },
    {
      title: 'J60 Joint Module',
      description: 'High-performance joint actuator for quadruped robot applications',
      filename: 'Chiral_J60Joint_Datasheet.pdf',
      icon: Wrench,
      features: ['High Torque', 'Precise Control', 'Durable Design', 'Modular'],
      fileSize: '873 KB'
    }
  ]

  const handleDownload = (filename) => {
    const link = document.createElement('a')
    link.href = `/downloads/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Product Resources
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Download comprehensive technical specifications, datasheets, and documentation 
              for our complete range of quadruped robotics solutions.
            </p>
            <div className="flex items-center justify-center gap-4 text-blue-200">
              <FileText className="h-6 w-6" />
              <span>Professional Grade Documentation</span>
              <span>•</span>
              <Download className="h-6 w-6" />
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Technical Datasheets
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access detailed specifications, performance data, and technical documentation 
                for informed decision-making and integration planning.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productDatasheets.map((product, index) => {
                const IconComponent = product.icon
                return (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {product.title}
                          </CardTitle>
                          <div className="text-sm text-gray-500 mt-1">
                            {product.fileSize}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleDownload(product.filename)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors group-hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Datasheet
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Additional Resources */}
            <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Need More Information?
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our technical team is ready to provide customized solutions, 
                  integration support, and detailed consultations for your specific requirements.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Custom Documentation
                </Button>
                <Button 
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Contact Technical Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloads

