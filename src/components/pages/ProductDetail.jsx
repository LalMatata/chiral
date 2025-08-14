import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import BrochureDisplay from '../BrochureDisplay'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x30Action from '../../assets/images/products/x30-action.jpg'
import x20Main from '../../assets/images/products/x20-main.jpg'
import x20Terrain from '../../assets/images/products/x20-terrain.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import lite3Detailed from '../../assets/images/products/lite3-detailed.jpg'

const ProductDetail = () => {
  const { model } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)

  const productData = {
    x30: {
      name: 'X30 Series',
      tagline: 'Industrial Flagship',
      description: 'The X30 Series represents the ultimate in industrial quadruped robotics, combining exceptional durability, advanced AI capabilities, and comprehensive sensor integration.',
      images: [x30Hero, x30Action],
      specifications: {
        'Physical': {
          'Dimensions': '1000×695×470mm',
          'Weight': '56kg (including battery)',
          'Protection': 'IP67',
          'Temperature': '-20°C to 55°C'
        },
        'Performance': {
          'Max Speed': '≥4m/s',
          'Slope Capability': '≤45°',
          'Obstacle Height': '≥20cm',
          'Endurance': '2.5-4 hours',
          'Range': '≥10km'
        }
      },
      features: [
        'Extreme weather operation (-20°C to 55°C)',
        'Superior IP67 protection rating',
        'Advanced mobility (45° slopes, 20cm obstacles)',
        'Extended endurance (2.5-4 hours)',
        'High-speed operation (4m/s)',
        'Industrial-grade reliability'
      ],
      applications: [
        'Power plant inspections',
        'Petrochemical facility monitoring',
        'Mining operations',
        'Emergency response',
        'Critical infrastructure security',
        'Environmental monitoring'
      ]
    },
    x20: {
      name: 'X20 Series',
      tagline: 'Patrol & Inspection Specialist',
      description: 'The X20 Series is engineered for comprehensive industrial patrol and inspection operations with exceptional mobility and payload capacity.',
      images: [x20Main, x20Terrain],
      specifications: {
        'Physical': {
          'Dimensions': '950×470×700mm',
          'Weight': '53kg',
          'Max Load': '20kg',
          'Protection': 'IP66'
        },
        'Performance': {
          'Max Speed': '≥4m/s',
          'Slope Capability': '≥30°',
          'Obstacle Height': '≥20cm',
          'Endurance': '2-4 hours',
          'Range': '15km'
        }
      },
      features: [
        'All-terrain capability (30° slopes)',
        'Substantial payload capacity (20kg)',
        'Weather resistance (IP66)',
        'Extended operational range (15km)',
        'Modular sensor integration',
        'Autonomous navigation'
      ],
      applications: [
        'Industrial facility patrols',
        'Equipment inspections',
        'Security surveillance',
        'Hazard detection',
        'Maintenance support',
        'Emergency response coordination'
      ]
    },
    lite3: {
      name: 'Lite3 Series',
      tagline: 'Advanced Research Platform',
      description: 'The Lite3 Series provides an accessible entry point into advanced quadruped robotics for research, development, and specialized applications.',
      images: [lite3Main, lite3Detailed],
      specifications: {
        'Physical': {
          'Dimensions': '610×370×406mm',
          'Weight': '12kg (including battery)',
          'Walking Load': '5kg',
          'Stair Climbing': '18cm'
        },
        'Performance': {
          'Max Speed': '2.5m/s',
          'Slope Capability': '40°',
          'Endurance': '1.5-2 hours',
          'Range': '5km'
        }
      },
      features: [
        'Enhanced agility (50% increased joint torque)',
        'Advanced algorithms and motion control',
        'Compact design (12kg lightweight)',
        'Steep slope capability (40°)',
        'Comprehensive development platform',
        'SDK and API access'
      ],
      applications: [
        'Research and development',
        'Educational robotics',
        'Indoor inspections',
        'Prototype development',
        'Algorithm testing',
        'Academic research'
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
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => {
                  // Track quote request
                  if (window.trackQuoteRequest) {
                    window.trackQuoteRequest(product.name)
                  }
                  if (window.fbTrackLead) {
                    window.fbTrackLead(2500)
                  }
                  if (window.linkedinTrackLead) {
                    window.linkedinTrackLead()
                  }
                  // Redirect to contact with product pre-selected
                  window.location.href = `/contact?product=${model}&type=quote`
                }}
              >
                Get Quick Quote
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/contact?product=${model}&type=demo`}>Request Demo</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/contact?product=${model}&type=info`}>Get Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="specifications" className="mb-20">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <TabsContent value="support" className="mt-8">
            <div className="space-y-8">
              {/* Download Resources */}
              <BrochureDisplay category={model} />
              
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
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Learn More?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us for detailed information, pricing, and to discuss your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Get Information
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail