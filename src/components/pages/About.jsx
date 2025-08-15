import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import AnimatedPage from '../AnimatedPage'

// Import images
import modernOffice from '../../assets/images/company/modern-office.jpg'

const About = () => {
  const { t } = useLanguage()

  const aboutData = t('about')
  const impactStats = aboutData.impact?.stats || []

  return (
    <AnimatedPage>
      <div className="min-h-screen py-20">
        <div className="container-apple">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-headline text-foreground">
              {aboutData.hero?.title}
            </h1>
            <p className="text-body-large text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {aboutData.hero?.subtitle}
            </p>
          </div>

          {/* Hero Image & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={modernOffice}
                alt="CHIRAL Office"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-title text-foreground">
                {aboutData.story?.title}
              </h2>
              <div className="text-body-large text-muted-foreground leading-relaxed space-y-4">
                {aboutData.story?.content?.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="card-apple p-8">
              <div className="mb-4">
                <h3 className="text-title-sm">{aboutData.mission?.title}</h3>
              </div>
              <div>
                <p className="text-body-large text-muted-foreground leading-relaxed">
                  {aboutData.mission?.content}
                </p>
              </div>
            </div>
            
            <div className="card-apple p-8">
              <div className="mb-4">
                <h3 className="text-title-sm">{aboutData.vision?.title}</h3>
              </div>
              <div>
                <p className="text-body-large text-muted-foreground leading-relaxed">
                  {aboutData.vision?.content}
                </p>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          {impactStats.length > 0 && (
            <div className="mb-20">
              <h2 className="text-title text-foreground text-center mb-12">
                {aboutData.impact?.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {impactStats.map((stat, index) => (
                  <div key={index} className="card-apple text-center p-6 hover-lift">
                    <div className="pt-6">
                      <div className="text-display font-bold gradient-text mb-2">{stat.value}</div>
                      <div className="text-subtitle font-semibold mb-1">{stat.label}</div>
                      <div className="text-caption text-muted-foreground">{stat.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center card-apple p-12">
            <h2 className="text-title text-foreground mb-6">
              Ready to Partner with CHIRAL?
            </h2>
            <p className="text-body-large text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the growing number of Israeli enterprises that trust CHIRAL for their robotic automation needs. Let's discuss how we can transform your operations together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-apple btn-apple-primary group">
                Get Information
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products" className="btn-apple btn-apple-secondary">
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default About