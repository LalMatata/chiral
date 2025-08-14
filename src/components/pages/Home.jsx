import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Settings, CheckCircle } from 'lucide-react'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x20Main from '../../assets/images/products/x20-main.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import industrialFacility from '../../assets/images/applications/industrial-facility.jpg'

const Home = () => {

  const products = [
    {
      title: 'X30 Series - Industrial Flagship',
      description: 'The pinnacle of industrial quadruped robotics, engineered for the most demanding operational environments.',
      image: x30Hero,
      link: '/products/x30',
      features: ['IP67 Protection', '4m/s Max Speed', '2.5-4h Endurance', '10km Range']
    },
    {
      title: 'X20 Series - Patrol & Inspection Specialist',
      description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility.',
      image: x20Main,
      link: '/products/x20',
      features: ['20kg Payload', 'IP66 Protection', '15km Range', 'All-Terrain']
    },
    {
      title: 'Lite3 Series - Versatile Research Platform',
      description: 'An accessible entry point into advanced robotics for research institutions and smaller operations.',
      image: lite3Main,
      link: '/products/lite3',
      features: ['12kg Weight', '40° Slope', 'SDK Included', 'Research Platform']
    }
  ]

  const applications = [
    {
      title: 'Power & Utilities',
      description: 'Automated inspection capabilities for power plants, transmission lines, and distribution facilities.',
      icon: Zap,
      image: industrialFacility
    },
    {
      title: 'Security & Surveillance',
      description: 'Advanced surveillance capabilities that complement traditional security measures.',
      icon: Shield,
      image: industrialFacility
    },
    {
      title: 'Industrial Inspection',
      description: 'Automated inspection solutions for manufacturing facilities and processing centers.',
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
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Revolutionizing Israeli Industry with Advanced Quadruped Robotics
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                CHIRAL brings cutting-edge robotic solutions to Israel's most demanding industrial environments. From power utilities to security applications, our autonomous quadruped robots deliver unmatched performance, reliability, and intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    Get Information Today
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/products">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
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

      {/* Value Proposition */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose CHIRAL for Your Industrial Robotics Needs?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              In Israel's rapidly evolving industrial landscape, staying ahead requires embracing the most advanced technologies available. CHIRAL specializes in delivering state-of-the-art quadruped robotic solutions specifically tailored for Israeli enterprises across power utilities, manufacturing, security, and research sectors.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {trustIndicators.map((indicator, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {indicator.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {indicator.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Advanced Robotic Solutions for Every Industrial Challenge
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{product.title}</h3>
                  </div>
                </div>
                <CardHeader>
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={product.link}>
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Transforming Israeli Industry Across Critical Sectors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-lg w-fit">
                    <app.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{app.title}</CardTitle>
                  <CardDescription className="text-base">
                    {app.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Trusted by Leading Israeli Enterprises
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            CHIRAL has established itself as Israel's premier provider of industrial quadruped robotics solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Get Information
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/applications">View Applications</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home