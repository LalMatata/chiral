import React, { useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import LeadCaptureForm from '../LeadCaptureForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Users, Video, Settings, Shield } from 'lucide-react'

const Demo = () => {
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    document.title = 'Request Demo - CHIRAL Quadruped Robotics | See Our Robots in Action'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Request a personalized demonstration of CHIRAL\'s advanced quadruped robots. See how our autonomous inspection and patrol robots can transform your industrial operations.')
    }

    // Add structured data for demo page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Request Demo - CHIRAL Robotics",
      "description": "Request a personalized demonstration of CHIRAL's quadruped robotics solutions",
      "url": "https://chiral.manus.space/demo",
      "mainEntity": {
        "@type": "Service",
        "name": "Robot Demonstration Service",
        "provider": {
          "@type": "Organization",
          "name": "CHIRAL Robotics"
        }
      }
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)
    
    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript && existingScript.text.includes('Robot Demonstration Service')) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const demoFeatures = [
    {
      icon: Video,
      title: 'Live Robot Demonstration',
      description: 'Watch our quadruped robots navigate real-world scenarios and perform inspection tasks'
    },
    {
      icon: Settings,
      title: 'Customized Scenarios',
      description: 'See demonstrations tailored to your specific industry and application requirements'
    },
    {
      icon: Users,
      title: 'Expert Consultation',
      description: 'Discuss your needs with our robotics engineers and application specialists'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Learn about safety features, certifications, and regulatory compliance'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Choose from on-site visits, virtual demonstrations, or facility tours'
    },
    {
      icon: CheckCircle,
      title: 'ROI Analysis',
      description: 'Receive detailed cost-benefit analysis and implementation roadmap'
    }
  ]

  const demoTypes = [
    {
      title: 'Virtual Demo',
      duration: '30-45 minutes',
      description: 'Interactive online demonstration with live Q&A session',
      features: [
        'Live robot operation via video feed',
        'Real-time interaction with our team',
        'Customized presentation for your use case',
        'Technical documentation provided'
      ]
    },
    {
      title: 'On-Site Demo',
      duration: '2-4 hours',
      description: 'Comprehensive demonstration at your facility or our demo center',
      features: [
        'Hands-on robot interaction',
        'Site-specific scenario testing',
        'Team training session',
        'Detailed technical assessment'
      ]
    },
    {
      title: 'Pilot Program',
      duration: '2-4 weeks',
      description: 'Extended evaluation with robot deployment at your facility',
      features: [
        'Real-world testing in your environment',
        'Performance data collection',
        'Staff training and support',
        'Comprehensive evaluation report'
      ]
    }
  ]

  const handleDemoSubmit = (formData) => {
    // Track demo request conversion
    if (typeof gtag !== 'undefined') {
      gtag('event', 'demo_request', {
        event_category: 'lead_generation',
        event_label: formData.industry,
        value: 1
      })
    }

    // Send to CRM or lead management system
    console.log('Demo request submitted:', formData)
    
    // You can integrate with your CRM here
    // Example: sendToCRM(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See CHIRAL Robots in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the future of industrial automation with a personalized demonstration 
            of our advanced quadruped robotics solutions. See how CHIRAL can transform your operations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Customized to your needs</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Expert consultation included</span>
            </div>
          </div>
        </div>

        {/* Demo Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Choose Your Demo Experience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoTypes.map((demo, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    {demo.title}
                  </CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {demo.duration}
                  </CardDescription>
                  <p className="text-gray-600 text-sm">
                    {demo.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {demo.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Demo Request Form */}
        <div className="mb-12">
          <LeadCaptureForm 
            formType="demo" 
            onSubmit={handleDemoSubmit}
            className="shadow-lg"
          />
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What to Expect from Your Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Before the Demo
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Pre-demo consultation to understand your specific needs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Customized demonstration scenarios prepared</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Technical documentation and materials provided</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Meeting logistics and technical requirements confirmed</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                During the Demo
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Live robot operation and capability demonstration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Interactive Q&A with our robotics experts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Discussion of implementation requirements and timeline</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>ROI analysis and cost-benefit discussion</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              After the Demo
            </h3>
            <p className="text-gray-600 mb-4">
              Following your demonstration, you'll receive a comprehensive follow-up package including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Detailed technical specifications</li>
                <li>• Customized implementation proposal</li>
                <li>• ROI analysis and business case</li>
              </ul>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Training and support options</li>
                <li>• Financing and leasing information</li>
                <li>• Next steps and timeline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Have Questions? We're Here to Help
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is available to answer any questions about our robotics solutions or the demonstration process.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Expert consultation available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Response within 24 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Confidential and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Demo

