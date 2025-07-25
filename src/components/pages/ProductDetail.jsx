import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, CheckCircle, Download, Play, Star } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x30Action from '../../assets/images/products/x30-action.jpg'
import x20Main from '../../assets/images/products/x20-main.jpg'
import x20Terrain from '../../assets/images/products/x20-terrain.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import lite3Detailed from '../../assets/images/products/lite3-detailed.jpg'

const ProductDetail = () => {
  const { model } = useParams()
  const { t, isRTL } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)

  const productData = {
    x30: {
      name: 'X30 Series',
      tagline: 'Industrial Flagship',
      description: 'The X30 Series represents the ultimate in industrial quadruped robotics, combining exceptional durability, advanced AI capabilities, and comprehensive sensor integration. Designed for the most challenging industrial environments, the X30 delivers uncompromising performance in applications where reliability is non-negotiable.',
      images: [x30Hero, x30Action],
      specifications: {
        'Physical Dimensions': {
          'Dimensions': '1000×695×470mm',
          'Weight': '56kg (including battery)',
          'Protection Rating': 'IP67',
          'Operating Temperature': '-20°C to 55°C'
        },
        'Performance': {
          'Maximum Speed': '≥4m/s',
          'Slope Capability': '≤45°',
          'Obstacle Height': '≥20cm',
          'Battery Endurance': '2.5-4 hours',
          'Maximum Range': '≥10km'
        },
        'Communication': {
          'Connectivity': 'Ethernet',
          'Power Output': '72V',
          'Data Transmission': 'Real-time streaming',
          'Control': 'Autonomous with manual override'
        }
      },
      features: [
        'Extreme weather operation (-20°C to 55°C)',
        'Superior IP67 protection rating',
        'Advanced mobility (45° slopes, 20cm obstacles)',
        'Extended endurance (2.5-4 hours)',
        'High-speed operation (4m/s)',
        'Industrial-grade reliability',
        'Comprehensive sensor integration',
        'Real-time data transmission',
        'Autonomous navigation system',
        'Emergency response capabilities'
      ],
      applications: [
        'Power plant inspections',
        'Petrochemical facility monitoring',
        'Mining operations',
        'Emergency response',
        'Critical infrastructure security',
        'Environmental monitoring in extreme conditions',
        'Hazardous area surveillance',
        'Equipment condition monitoring'
      ],
      benefits: [
        '75% reduction in human exposure to hazardous environments',
        '40% improvement in inspection frequency and coverage',
        '25% reduction in unplanned maintenance events',
        'Enhanced compliance with safety regulations',
        'Significant cost savings in operational expenses',
        'Improved worker safety and risk management'
      ]
    },
    x20: {
      name: 'X20 Series',
      tagline: 'Patrol & Inspection Specialist',
      description: 'The X20 Series is specifically engineered for comprehensive industrial patrol and inspection operations. Its balanced combination of mobility, payload capacity, and advanced perception systems makes it the ideal choice for routine monitoring, security patrols, and detailed facility inspections across Israel\'s industrial sector.',
      images: [x20Main, x20Terrain],
      specifications: {
        'Physical Dimensions': {
          'Dimensions': '950×470×700mm',
          'Weight': '53kg',
          'Maximum Load': '20kg',
          'Protection Rating': 'IP66'
        },
        'Performance': {
          'Maximum Speed': '≥4m/s',
          'Slope Capability': '≥30°',
          'Obstacle Height': '≥20cm',
          'Battery Endurance': '2-4 hours',
          'Maximum Range': '15km'
        },
        'Features': {
          'Navigation': 'Autonomous with obstacle avoidance',
          'Sensor Integration': 'Modular design',
          'Weather Resistance': 'All-weather operation',
          'Deployment': 'Flexible configuration options'
        }
      },
      features: [
        'All-terrain capability (30° slopes)',
        'Substantial payload capacity (20kg)',
        'Weather resistance (IP66)',
        'Extended operational range (15km)',
        'Modular sensor integration',
        'Autonomous navigation',
        'Real-time monitoring',
        'Flexible deployment options',
        'Advanced perception systems',
        'Emergency alert capabilities'
      ],
      applications: [
        'Industrial facility patrols',
        'Equipment inspections',
        'Security surveillance',
        'Hazard detection',
        'Maintenance support',
        'Emergency response coordination',
        'Perimeter monitoring',
        'Asset tracking and management'
      ],
      benefits: [
        '60% improvement in hazardous area inspection coverage',
        '50% reduction in safety incidents during inspection activities',
        '30% improvement in early detection of equipment anomalies',
        'Enhanced regulatory compliance documentation',
        '24/7 autonomous patrol capabilities',
        'Reduced security personnel exposure to outdoor conditions'
      ]
    },
    lite3: {
      name: 'Lite3 Series',
      tagline: 'Advanced Research Platform',
      description: 'The Lite3 Series provides an accessible entry point into advanced quadruped robotics while maintaining sophisticated capabilities essential for research, development, and specialized applications. Its compact design and advanced features make it ideal for educational institutions, research facilities, and innovative industrial applications.',
      images: [lite3Main, lite3Detailed],
      specifications: {
        'Physical Dimensions': {
          'Dimensions': '610×370×406mm',
          'Weight': '12kg (including battery)',
          'Walking Load': '5kg',
          'Stair Climbing': '18cm'
        },
        'Performance': {
          'Maximum Speed': '2.5m/s',
          'Slope Capability': '40°',
          'Battery Endurance': '1.5-2 hours',
          'Maximum Range': '5km'
        },
        'Development': {
          'SDK': 'Motion control SDK included',
          'APIs': 'Perception APIs available',
          'Programming': 'Sample code provided',
          'Perception': 'Front/rear obstacle detection, visual following'
        }
      },
      features: [
        'Enhanced agility (50% increased joint torque)',
        'Advanced algorithms and motion control',
        'Compact design (12kg lightweight)',
        'Steep slope capability (40°)',
        'Comprehensive development platform',
        'SDK and API access',
        'Educational support',
        'Research-friendly architecture',
        'Customizable sensor packages',
        'Open development environment'
      ],
      applications: [
        'Research and development',
        'Educational robotics',
        'Indoor inspections',
        'Prototype development',
        'Algorithm testing',
        'Academic research',
        'Innovation projects',
        'Technology demonstrations'
      ],
      benefits: [
        'Accelerated research project timelines',
        'Enhanced student learning experiences',
        'Multiple published research opportunities',
        'Successful technology transfer initiatives',
        'Reduced development costs',
        'Flexible customization options'
      ]
    }
  }

  const product = productData[model]

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
              {model === 'x30' && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-primary font-semibold mb-4">
                {product.tagline}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" asChild>
                  <Link to="/contact">
                    {t('nav.requestDemo')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Download className={`h-5 w-5 ${isRTL ? 'ml-2 mr-0' : 'mr-2'}`} />
                  Download Specs
                </Button>
              </div>
              <Button variant="ghost" size="lg" className="w-full">
                <Play className={`h-5 w-5 ${isRTL ? 'ml-2 mr-0' : 'mr-2'}`} />
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="specifications" className="mb-20">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specifications">{t('products.specifications')}</TabsTrigger>
            <TabsTrigger value="applications">{t('products.applications')}</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(product.specifications).map(([category, specs]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(specs).map(([spec, value]) => (
                        <div key={spec} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{spec}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.applications.map((application, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="font-medium">{application}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Support</CardTitle>
                  <CardDescription>
                    Comprehensive technical assistance for optimal system performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">24/7 emergency support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">On-site maintenance services</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Remote diagnostics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Software updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training & Education</CardTitle>
                  <CardDescription>
                    Comprehensive training programs for your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Operator training programs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Maintenance certification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Safety protocols training</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Advanced applications workshop</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Interested in Other Solutions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our complete range of quadruped robotics solutions designed for different applications and requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">{t('common.contactUs')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

