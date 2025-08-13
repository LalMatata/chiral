import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x30Action from '../../assets/images/products/x30-action.jpg'
import x20Main from '../../assets/images/products/x20-main.jpg'
import x20Terrain from '../../assets/images/products/x20-terrain.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import lite3Detailed from '../../assets/images/products/lite3-detailed.jpg'

const Products = () => {

  const products = [
    {
      id: 'x30',
      name: 'X30 Series',
      tagline: 'Industrial Flagship',
      description: 'The pinnacle of industrial quadruped robotics, engineered specifically for the most demanding operational environments.',
      price: 'Contact for Pricing',
      featured: true,
      images: [x30Hero, x30Action],
      specifications: {
        dimensions: '1000×695×470mm',
        weight: '56kg (including battery)',
        maxSpeed: '≥4m/s',
        slopeCapability: '≤45°',
        obstacleHeight: '≥20cm',
        protection: 'IP67',
        temperature: '-20°C to 55°C',
        endurance: '2.5-4 hours',
        range: '≥10km',
        communication: 'Ethernet, 72V power output'
      },
      features: [
        'Extreme weather operation (-20°C to 55°C)',
        'Superior IP67 protection rating',
        'Advanced mobility (45° slopes, 20cm obstacles)',
        'Extended endurance (2.5-4 hours)',
        'High-speed operation (4m/s)',
        'Industrial-grade reliability',
        'Comprehensive sensor integration',
        'Real-time data transmission'
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
    {
      id: 'x20',
      name: 'X20 Series',
      tagline: 'Patrol & Inspection Specialist',
      description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility and payload capacity.',
      price: 'Contact for Pricing',
      featured: false,
      images: [x20Main, x20Terrain],
      specifications: {
        dimensions: '950×470×700mm',
        weight: '53kg',
        maxLoad: '20kg',
        maxSpeed: '≥4m/s',
        slopeCapability: '≥30°',
        obstacleHeight: '≥20cm',
        protection: 'IP66',
        endurance: '2-4 hours',
        range: '15km'
      },
      features: [
        'All-terrain capability (30° slopes)',
        'Substantial payload capacity (20kg)',
        'Weather resistance (IP66)',
        'Extended operational range (15km)',
        'Modular sensor integration',
        'Autonomous navigation',
        'Real-time monitoring',
        'Flexible deployment options'
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
    {
      id: 'lite3',
      name: 'Lite3 Series',
      tagline: 'Advanced Research Platform',
      description: 'An accessible entry point into advanced quadruped robotics while maintaining sophisticated capabilities for research and development.',
      price: 'Contact for Pricing',
      featured: false,
      images: [lite3Main, lite3Detailed],
      specifications: {
        dimensions: '610×370×406mm',
        weight: '12kg (including battery)',
        walkingLoad: '5kg',
        maxSpeed: '2.5m/s',
        slopeCapability: '40°',
        stairClimbing: '18cm',
        endurance: '1.5-2 hours',
        range: '5km',
        perception: 'Front/rear obstacle detection, visual following',
        development: 'Motion control SDK, perception APIs, sample code'
      },
      features: [
        'Enhanced agility (50% increased joint torque)',
        'Advanced algorithms and motion control',
        'Compact design (12kg lightweight)',
        'Steep slope capability (40°)',
        'Comprehensive development platform',
        'SDK and API access',
        'Educational support',
        'Research-friendly architecture'
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
  ]

  const comparisonFeatures = [
    { feature: 'Max Speed', x30: '≥4m/s', x20: '≥4m/s', lite3: '2.5m/s' },
    { feature: 'Slope Capability', x30: '≤45°', x20: '≥30°', lite3: '40°' },
    { feature: 'Protection Rating', x30: 'IP67', x20: 'IP66', lite3: 'Standard' },
    { feature: 'Endurance', x30: '2.5-4h', x20: '2-4h', lite3: '1.5-2h' },
    { feature: 'Payload', x30: 'High', x20: '20kg', lite3: '5kg' },
    { feature: 'Range', x30: '≥10km', x20: '15km', lite3: '5km' },
    { feature: 'Primary Use', x30: 'Industrial', x20: 'Patrol/Inspection', lite3: 'Research/Education' }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Choose the Right Robotic Solution for Your Needs
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            CHIRAL offers three distinct product lines, each engineered to address specific operational requirements and budget considerations.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {products.map((product) => (
            <Card key={product.id} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${product.featured ? 'ring-2 ring-primary' : ''}`}>
              {product.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-sm opacity-90">{product.tagline}</p>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="text-base">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Features */}
                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="space-y-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t">
                  <div className="text-lg font-semibold text-foreground mb-4">
                    {product.price}
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link to={`/products/${product.id}`}>
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/contact">Get Information</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Product Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">X30 Series</th>
                  <th className="text-center p-4 font-semibold">X20 Series</th>
                  <th className="text-center p-4 font-semibold">Lite3 Series</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">{row.x30}</td>
                    <td className="p-4 text-center">{row.x20}</td>
                    <td className="p-4 text-center">{row.lite3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Need Help Choosing the Right Solution?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our experts are ready to help you select the perfect robotic solution for your specific needs and requirements.
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
      </div>
    </div>
  )
}

export default Products

