import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, ChevronLeft, ChevronRight, Zap, Shield, Settings, Cpu, Mountain, Clock } from 'lucide-react'
import AnimatedPage from '../AnimatedPage'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x30Action from '../../assets/images/products/x30-action.jpg'
import x20Main from '../../assets/images/products/x20-main.jpg'
import x20Terrain from '../../assets/images/products/x20-terrain.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import lite3Detailed from '../../assets/images/products/lite3-detailed.jpg'

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState({})

  const products = [
    {
      id: 'x30',
      name: 'X30 Series',
      tagline: 'Industrial Flagship',
      description: 'The pinnacle of industrial quadruped robotics, engineered specifically for the most demanding operational environments.',
      price: 'Enterprise Solution',
      featured: true,
      images: [x30Hero, x30Action],
      color: 'from-blue-600 to-cyan-500',
      icon: Shield,
      specifications: {
        dimensions: '1000×695×470mm',
        weight: '56kg',
        maxSpeed: '≥4m/s',
        slopeCapability: '≤45°',
        obstacleHeight: '≥20cm',
        protection: 'IP67',
        temperature: '-20°C to 55°C',
        endurance: '2.5-4 hours',
        range: '≥10km'
      },
      highlights: [
        { icon: Shield, text: 'IP67 Protection', detail: 'Extreme weather resistance' },
        { icon: Zap, text: '4m/s Speed', detail: 'Industry-leading velocity' },
        { icon: Mountain, text: '45° Slopes', detail: 'Superior terrain capability' },
        { icon: Clock, text: '4h Endurance', detail: 'Extended operations' }
      ],
      features: [
        'Extreme weather operation (-20°C to 55°C)',
        'Superior IP67 protection rating',
        'Advanced mobility (45° slopes, 20cm obstacles)',
        'Extended endurance (2.5-4 hours)',
        'High-speed operation (4m/s)',
        'Industrial-grade reliability',
        'Comprehensive sensor integration',
        'Real-time data transmission'
      ]
    },
    {
      id: 'x20',
      name: 'X20 Series',
      tagline: 'Patrol & Inspection',
      description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility and payload capacity.',
      price: 'Professional Solution',
      featured: false,
      images: [x20Main, x20Terrain],
      color: 'from-purple-600 to-pink-500',
      icon: Settings,
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
      highlights: [
        { icon: Settings, text: '20kg Payload', detail: 'Heavy equipment capacity' },
        { icon: Mountain, text: '15km Range', detail: 'Extended patrol distance' },
        { icon: Shield, text: 'IP66 Protection', detail: 'Weather resistant' },
        { icon: Zap, text: 'All-Terrain', detail: 'Versatile deployment' }
      ],
      features: [
        'All-terrain capability (30° slopes)',
        'Substantial payload capacity (20kg)',
        'Weather resistance (IP66)',
        'Extended operational range (15km)',
        'Modular sensor integration',
        'Autonomous navigation',
        'Real-time monitoring',
        'Flexible deployment options'
      ]
    },
    {
      id: 'lite3',
      name: 'Lite3 Series',
      tagline: 'Research Platform',
      description: 'An accessible entry point into advanced quadruped robotics while maintaining sophisticated capabilities for research and development.',
      price: 'Development Solution',
      featured: false,
      images: [lite3Main, lite3Detailed],
      color: 'from-green-600 to-teal-500',
      icon: Cpu,
      specifications: {
        dimensions: '610×370×406mm',
        weight: '12kg',
        walkingLoad: '5kg',
        maxSpeed: '2.5m/s',
        slopeCapability: '40°',
        stairClimbing: '18cm',
        endurance: '1.5-2 hours',
        range: '5km'
      },
      highlights: [
        { icon: Cpu, text: 'SDK Included', detail: 'Full development kit' },
        { icon: Zap, text: '12kg Weight', detail: 'Ultra-lightweight' },
        { icon: Mountain, text: '40° Slopes', detail: 'Agile movement' },
        { icon: Settings, text: 'Open Platform', detail: 'Research-friendly' }
      ],
      features: [
        'Enhanced agility (50% increased joint torque)',
        'Advanced algorithms and motion control',
        'Compact design (12kg lightweight)',
        'Steep slope capability (40°)',
        'Comprehensive development platform',
        'SDK and API access',
        'Educational support',
        'Research-friendly architecture'
      ]
    }
  ]

  const AnimatedSection = ({ children, className = "" }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  const nextImage = (productId) => {
    const product = products.find(p => p.id === productId)
    const currentIndex = activeImageIndex[productId] || 0
    const nextIndex = (currentIndex + 1) % product.images.length
    setActiveImageIndex({ ...activeImageIndex, [productId]: nextIndex })
  }

  const prevImage = (productId) => {
    const product = products.find(p => p.id === productId)
    const currentIndex = activeImageIndex[productId] || 0
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1
    setActiveImageIndex({ ...activeImageIndex, [productId]: prevIndex })
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-apple text-center space-y-6">
            <motion.p 
              className="text-sm font-semibold text-blue-600 tracking-wider uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Product Lineup
            </motion.p>
            
            <motion.h1 
              className="text-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Choose Your Perfect
              <br />
              <span className="gradient-text">Robotic Solution</span>
            </motion.h1>
            
            <motion.p 
              className="text-body-large text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Three distinct product lines, each engineered to address specific operational requirements and deliver exceptional value.
            </motion.p>
          </div>
        </section>

        {/* Interactive Product Showcase */}
        <AnimatedSection className="section-padding">
          <div className="container-apple">
            {/* Product Selector Tabs */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1 bg-gray-100 rounded-full">
                {products.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(index)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedProduct === index
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Product Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProduct}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Product Images with Carousel */}
                <div className="relative">
                  <div className="image-container aspect-[4/3] rounded-2xl">
                    <motion.img
                      src={products[selectedProduct].images[activeImageIndex[products[selectedProduct].id] || 0]}
                      alt={`${products[selectedProduct].name} - ${products[selectedProduct].tagline}`}
                      className="w-full h-full object-cover"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Image Navigation */}
                    {products[selectedProduct].images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(products[selectedProduct].id)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => nextImage(products[selectedProduct].id)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Badge */}
                    {products[selectedProduct].featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Most Advanced
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Image Dots */}
                  {products[selectedProduct].images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {products[selectedProduct].images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex({ 
                            ...activeImageIndex, 
                            [products[selectedProduct].id]: index 
                          })}
                          className={`w-2 h-2 rounded-full transition-all ${
                            (activeImageIndex[products[selectedProduct].id] || 0) === index
                              ? 'bg-black w-6'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-headline mb-2">
                      {products[selectedProduct].name}
                    </h2>
                    <p className="text-subtitle icon-primary mb-4">
                      {products[selectedProduct].tagline}
                    </p>
                    <p className="text-body text-gray-600">
                      {products[selectedProduct].description}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {products[selectedProduct].highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${products[selectedProduct].color}`}>
                          <highlight.icon className="h-5 w-5 icon-on-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{highlight.text}</div>
                          <div className="text-xs text-gray-500">{highlight.detail}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="font-semibold mb-4">Key Features</h3>
                    <div className="space-y-2">
                      {products[selectedProduct].features.slice(0, 5).map((feature, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <CheckCircle className="h-4 w-4 icon-success flex-shrink-0" />
                          <span className="text-body">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to={`/products/${products[selectedProduct].id}`}
                      className="btn-apple btn-apple-primary group"
                    >
                      View Full Details
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/contact"
                      className="btn-apple btn-apple-secondary"
                    >
                      Request Information
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </AnimatedSection>

        {/* Comparison Section - Apple Style */}
        <AnimatedSection className="section-padding bg-gray-50">
          <div className="container-apple">
            <div className="text-center mb-12">
              <h2 className="text-headline mb-4">
                Compare Our Solutions
              </h2>
              <p className="text-body-large text-gray-600">
                Find the perfect match for your operational requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="card-apple p-8 hover-lift"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} p-3 mb-6`}>
                    <product.icon className="w-full h-full icon-on-primary" />
                  </div>
                  
                  <h3 className="text-title-sm mb-2">{product.name}</h3>
                  <p className="text-subtitle icon-primary mb-4">{product.price}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-caption">Speed</span>
                      <span className="text-caption font-medium">{product.specifications.maxSpeed}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-caption">Range</span>
                      <span className="text-caption font-medium">{product.specifications.range}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-caption">Endurance</span>
                      <span className="text-caption font-medium">{product.specifications.endurance}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-caption">Protection</span>
                      <span className="text-caption font-medium">{product.specifications.protection}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/products/${product.id}`}
                    className="flex items-center justify-center icon-primary font-medium hover:gap-3 transition-all"
                  >
                    Learn More
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="section-padding bg-black text-white">
          <div className="container-apple text-center space-y-8">
            <h2 className="text-headline">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-body-large text-gray-300 max-w-3xl mx-auto">
              Our robotics experts are standing by to help you select and implement the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="btn-apple bg-white text-black hover:bg-gray-100 group"
              >
                Get Expert Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/applications" 
                className="btn-apple border border-white text-white hover:bg-white hover:text-black transition-all"
              >
                View Use Cases
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  )
}

export default Products