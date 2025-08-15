import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Shield, Settings, Microscope } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import AnimatedPage from '../AnimatedPage'

// Import images
import industrialFacility from '../../assets/images/applications/industrial-facility.jpg'

const Applications = () => {
  const { t } = useLanguage()
  const applicationsData = t('applications')
  const homeData = t('home')
  const applicationItems = homeData?.applications?.items || []

  // Map icons for different applications
  const iconMap = {
    'Power & Utilities': Zap,
    'Security & Surveillance': Shield, 
    'Industrial Inspection': Settings,
    'Research & Development': Microscope
  }

  const colorMap = {
    'Power & Utilities': 'bg-yellow-500',
    'Security & Surveillance': 'bg-blue-500',
    'Industrial Inspection': 'bg-green-500', 
    'Research & Development': 'bg-purple-500'
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              {applicationsData?.hero?.title || homeData?.applications?.title || 'Industry Applications'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {applicationsData?.hero?.subtitle || homeData?.applications?.subtitle || 'See how CHIRAL\'s robotic solutions are transforming operations across diverse industries worldwide.'}
            </p>
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {applicationItems.map((app, index) => {
              const IconComponent = iconMap[app.title] || Settings
              const colorClass = colorMap[app.title] || 'bg-blue-500'
              
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={industrialFacility}
                      alt={app.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 ${colorClass} rounded-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
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
                    {/* Features */}
                    {app.features && (
                      <div>
                        <h4 className="font-semibold mb-3">Key Capabilities</h4>
                        <div className="space-y-1">
                          {app.features.map((feature, i) => (
                            <div key={i} className="text-sm text-muted-foreground">
                              • {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
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
    </AnimatedPage>
  )
}

export default Applications