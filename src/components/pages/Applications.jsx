import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import AnimatedPage from '../AnimatedPage'

// Import different images for each application
import industrialFacility from '../../assets/images/applications/industrial-facility.jpg'
import intelIsrael from '../../assets/images/applications/intel-israel.jpg'
import x30Action from '../../assets/images/products/x30-action.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'

const Applications = () => {
  const { t } = useLanguage()
  const applicationsData = t('applications')
  const homeData = t('home')
  const applicationItems = homeData?.applications?.items || []

  // Map different images for each application type
  const imageMap = {
    'Power & Utilities': industrialFacility,
    'Security & Surveillance': intelIsrael,
    'Industrial Inspection': x30Action,
    'Research & Development': lite3Main,
    // Hebrew titles
    'חשמל ותשתיות': industrialFacility,
    'אבטחה ומעקב': intelIsrael, 
    'בדיקה תעשייתית': x30Action,
    'מחקר ופיתוח': lite3Main
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen py-20">
        <div className="container-apple">
          {/* Header */}
          <div className="text-center space-y-6 mb-20">
            <h1 className="text-headline text-foreground">
              {applicationsData?.hero?.title || homeData?.applications?.title || 'Industry Applications'}
            </h1>
            <p className="text-body-large text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {applicationsData?.hero?.subtitle || homeData?.applications?.subtitle || 'See how CHIRAL\'s robotic solutions are transforming operations across diverse industries worldwide.'}
            </p>
          </div>

          {/* Applications Grid - Clean Design */}
          <div className="space-y-16 mb-20">
            {applicationItems.map((app, index) => {
              const isEven = index % 2 === 0
              const backgroundImage = imageMap[app.title] || industrialFacility
              
              return (
                <div 
                  key={index} 
                  className={`relative overflow-hidden rounded-3xl min-h-[500px] flex items-center ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={backgroundImage}
                      alt={app.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 w-full lg:w-1/2 p-12 lg:p-16 text-white">
                    <div className={`max-w-lg ${isEven ? 'lg:ml-0' : 'lg:ml-auto lg:text-right'}`}>
                      {/* Simple White Border Title */}
                      <div className={`inline-block border-2 border-white px-6 py-3 mb-6 ${
                        isEven ? '' : 'lg:ml-auto'
                      }`}>
                        <h2 className="text-title">
                          {app.title}
                        </h2>
                      </div>
                      
                      {/* Description */}
                      <p className="text-body-large text-white/90 mb-8 leading-relaxed">
                        {app.description}
                      </p>
                      
                      {/* Features with Simple White Text */}
                      {app.features && (
                        <div className="space-y-3">
                          {app.features.map((feature, i) => (
                            <div 
                              key={i} 
                              className={`text-body text-white/90 font-medium ${
                                isEven ? 'text-left' : 'lg:text-right'
                              }`}
                            >
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Empty space for image visibility */}
                  <div className="hidden lg:block lg:w-1/2"></div>
                </div>
              )
            })}
          </div>

          {/* CTA Section - Minimalist Style */}
          <div className="text-center bg-gradient-to-br from-foreground to-foreground/80 rounded-3xl p-16 text-white">
            <h2 className="text-headline mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-body-large text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover how CHIRAL's robotic solutions can enhance safety, efficiency, and reliability in your specific application.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact" className="btn-apple bg-white text-black hover:bg-gray-100 group">
                Get Information
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products" className="btn-apple border border-white text-white hover:bg-white hover:text-black transition-all">
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default Applications