import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Shield, Settings, Microscope } from 'lucide-react'

// Import images
import industrialFacility from '../../assets/images/applications/industrial-facility.jpg'

const Applications = () => {

  const applications = [
    {
      id: 'power-utilities',
      title: 'Power & Utilities',
      description: 'Revolutionizing power infrastructure management with automated inspection capabilities.',
      icon: Zap,
      image: industrialFacility,
      color: 'bg-yellow-500',
      details: {
        overview: 'Israel\'s power infrastructure is critical to national security and economic prosperity. CHIRAL\'s robotic solutions transform power infrastructure management by providing automated, comprehensive, and safe inspection capabilities.',
        useCases: [
          'Power plant equipment inspections',
          'Transmission line monitoring',
          'Distribution network assessment',
          'Thermal monitoring and analysis',
          'Gas leak detection',
          'Equipment condition monitoring'
        ],
        benefits: [
          '75% reduction in human exposure to hazardous environments',
          '40% improvement in inspection frequency and coverage',
          '25% reduction in unplanned maintenance events',
          'Enhanced compliance with safety regulations',
          'Real-time monitoring capabilities',
          'Predictive maintenance insights'
        ],
        recommendedProducts: ['X30 Series', 'X20 Series']
      }
    },
    {
      id: 'security-surveillance',
      title: 'Security & Surveillance',
      description: 'Advanced security solutions for critical infrastructure protection.',
      icon: Shield,
      image: industrialFacility,
      color: 'bg-blue-500',
      details: {
        overview: 'Israeli security requirements demand advanced solutions that can operate autonomously while providing comprehensive situational awareness. CHIRAL\'s robotic platforms offer unparalleled security capabilities.',
        useCases: [
          'Perimeter security patrols',
          'Critical infrastructure monitoring',
          'Threat detection and assessment',
          'Emergency response coordination',
          'Access control verification',
          'Incident documentation'
        ],
        benefits: [
          '24/7 autonomous patrol capabilities',
          '60% improvement in threat detection speed',
          'Enhanced personnel safety',
          'Real-time alert systems',
          'Comprehensive incident reporting',
          'Cost-effective security operations'
        ],
        recommendedProducts: ['X20 Series', 'X30 Series']
      }
    },
    {
      id: 'industrial-inspection',
      title: 'Industrial Inspection',
      description: 'Transforming industrial maintenance and safety with robotic solutions.',
      icon: Settings,
      image: industrialFacility,
      color: 'bg-green-500',
      details: {
        overview: 'Manufacturing and processing facilities require consistent, thorough inspection protocols. CHIRAL robots provide reliable, detailed assessments that enhance safety and operational efficiency.',
        useCases: [
          'Equipment health monitoring',
          'Quality assurance inspections',
          'Safety compliance verification',
          'Environmental monitoring',
          'Process optimization',
          'Maintenance scheduling'
        ],
        benefits: [
          '50% reduction in inspection time',
          'Improved safety compliance',
          'Enhanced data accuracy',
          'Predictive maintenance capabilities',
          'Reduced operational downtime',
          'Comprehensive documentation'
        ],
        recommendedProducts: ['X20 Series', 'Lite3 Series']
      }
    },
    {
      id: 'research-development',
      title: 'Research & Development',
      description: 'Enabling innovation in Israeli technology sector with advanced platforms.',
      icon: Microscope,
      image: industrialFacility,
      color: 'bg-purple-500',
      details: {
        overview: 'Research institutions and technology companies require flexible, programmable platforms for developing next-generation applications. CHIRAL provides comprehensive development tools and support.',
        useCases: [
          'Algorithm development and testing',
          'Sensor integration projects',
          'Educational robotics programs',
          'Prototype development',
          'Academic research initiatives',
          'Innovation demonstrations'
        ],
        benefits: [
          'Accelerated research timelines',
          'Comprehensive SDK access',
          'Educational support programs',
          'Flexible customization options',
          'Community development resources',
          'Technical documentation'
        ],
        recommendedProducts: ['Lite3 Series']
      }
    }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Advancing Israeli Industry Through Robotic Innovation
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Israeli enterprises need robotic systems that can operate reliably in demanding conditions while delivering exceptional performance.
          </p>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={app.image}
                  alt={app.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 ${app.color} rounded-lg`}>
                      <app.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{app.title}</h3>
                </div>
              </div>
              
              <CardHeader>
                <CardDescription className="text-base">
                  {app.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Use Cases */}
                <div>
                  <h4 className="font-semibold mb-3">Key Applications</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {app.details.useCases.slice(0, 4).map((useCase, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${app.color} rounded-full`} />
                        <span className="text-sm text-muted-foreground">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-3">Key Benefits</h4>
                  <div className="space-y-1">
                    {app.details.benefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        • {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Products */}
                <div>
                  <h4 className="font-semibold mb-3">Recommended Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.details.recommendedProducts.map((product, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover how CHIRAL's robotic solutions can enhance safety, efficiency, and reliability in your specific application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Get Information
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/products">View Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Applications