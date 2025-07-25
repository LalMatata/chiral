import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Settings, Search, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x20Main from '../../assets/images/products/x20-main.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import industrialFacility from '../../assets/images/applications/industrial-facility.jpg'
import intelIsrael from '../../assets/images/applications/intel-israel.jpg'
import teamDiverse from '../../assets/images/company/team-diverse.jpg'

const Home = () => {
  const { t, isRTL } = useLanguage()

  const products = [
    {
      title: t('home.x30Title'),
      description: t('home.x30Description'),
      image: x30Hero,
      link: '/products/x30',
      features: ['IP67 Protection', '4m/s Max Speed', '2.5-4h Endurance', '10km Range']
    },
    {
      title: t('home.x20Title'),
      description: t('home.x20Description'),
      image: x20Main,
      link: '/products/x20',
      features: ['20kg Payload', 'IP66 Protection', '15km Range', 'All-Terrain']
    },
    {
      title: t('home.lite3Title'),
      description: t('home.lite3Description'),
      image: lite3Main,
      link: '/products/lite3',
      features: ['12kg Weight', '40° Slope', 'SDK Included', 'Research Platform']
    }
  ]

  const applications = [
    {
      title: t('home.powerTitle'),
      description: t('home.powerDescription'),
      icon: Zap,
      image: industrialFacility
    },
    {
      title: t('home.securityTitle'),
      description: t('home.securityDescription'),
      icon: Shield,
      image: intelIsrael
    },
    {
      title: t('home.industrialTitle'),
      description: t('home.industrialDescription'),
      icon: Settings,
      image: industrialFacility
    }
  ]

  const trustIndicators = [
    { number: '50+', label: 'Deployed Systems' },
    { number: '25+', label: 'Industrial Facilities' },
    { number: '200+', label: 'Trained Personnel' },
    { number: '99.9%', label: 'Uptime Reliability' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isRTL ? 'lg:order-2' : ''}`}>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('home.heroTitle')}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    {t('home.heroButton')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/products">{t('common.learnMore')}</Link>
                </Button>
              </div>
            </div>
            <div className={`relative ${isRTL ? 'lg:order-1' : ''}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={x30Hero}
                  alt="CHIRAL X30 Robot"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('home.valueTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t('home.valueText')}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {indicator.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {indicator.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Overview Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('home.productsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={product.link}>
                      {t('products.learnMore')}
                      <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Showcase Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('home.applicationsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {applications.map((application, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={application.image}
                    alt={application.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <application.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{application.title}</CardTitle>
                  <CardDescription className="text-base">
                    {application.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/applications">
                {t('common.learnMore')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${isRTL ? 'lg:order-2' : ''}`}>
              <h2 className="text-3xl lg:text-4xl font-bold">
                {t('home.trustTitle')}
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                {t('home.trustDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/about">
                    {t('common.learnMore')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/contact">{t('common.contactUs')}</Link>
                </Button>
              </div>
            </div>
            <div className={`relative ${isRTL ? 'lg:order-1' : ''}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={teamDiverse}
                  alt="CHIRAL Team"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover how CHIRAL's advanced quadruped robotics can revolutionize your industrial operations. 
            Contact us today for a personalized demonstration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                {t('nav.requestDemo')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/products">{t('nav.downloadBrochure')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

