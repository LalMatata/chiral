import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { ArrowRight, Shield, Zap, Settings, CheckCircle, Play, ChevronRight } from 'lucide-react'
import AnimatedPage from '../AnimatedPage'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x20Main from '../../assets/images/products/x20-main.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'

const Home = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 })

  const products = [
    {
      title: 'X30 Series',
      subtitle: 'Industrial Flagship',
      description: 'The pinnacle of industrial quadruped robotics, engineered for the most demanding operational environments.',
      image: x30Hero,
      link: '/products/x30',
      features: ['IP67 Protection', '4m/s Max Speed', '2.5-4h Endurance', '10km Range'],
      badge: 'Most Advanced',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'X20 Series',
      subtitle: 'Patrol & Inspection',
      description: 'Designed for comprehensive industrial patrol and inspection operations with exceptional mobility.',
      image: x20Main,
      link: '/products/x20',
      features: ['20kg Payload', 'IP66 Protection', '15km Range', 'All-Terrain'],
      badge: 'Best Seller',
      color: 'from-purple-600 to-pink-500'
    },
    {
      title: 'Lite3 Series',
      subtitle: 'Research Platform',
      description: 'An accessible entry point into advanced robotics for research institutions and smaller operations.',
      image: lite3Main,
      link: '/products/lite3',
      features: ['12kg Weight', '40° Slope', 'SDK Included', 'Research Platform'],
      badge: 'Entry Level',
      color: 'from-green-600 to-teal-500'
    }
  ]

  const stats = [
    { value: '50+', label: 'Deployed Systems', trend: '+15%' },
    { value: '25+', label: 'Industrial Facilities', trend: '+23%' },
    { value: '200+', label: 'Trained Personnel', trend: '+42%' },
    { value: '99.9%', label: 'Uptime Reliability', trend: 'Industry Leading' }
  ]

  const applications = [
    {
      title: 'Power & Utilities',
      description: 'Automated inspection capabilities for power plants, transmission lines, and distribution facilities.',
      icon: Zap,
      features: ['Thermal Imaging', 'Gas Detection', 'Predictive Maintenance'],
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Security & Surveillance',
      description: 'Advanced surveillance capabilities that complement traditional security measures.',
      icon: Shield,
      features: ['24/7 Patrol', 'AI Detection', 'Real-time Alerts'],
      gradient: 'from-red-500 to-pink-500'
    },
    {
      title: 'Industrial Inspection',
      description: 'Automated inspection solutions for manufacturing facilities and processing centers.',
      icon: Settings,
      features: ['Quality Control', 'Safety Monitoring', 'Process Optimization'],
      gradient: 'from-blue-500 to-purple-500'
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

  return (
    <AnimatedPage>
      <div className="min-h-screen overflow-hidden">
        {/* Hero Section - Apple Style */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: smoothHeroY, scale: heroScale }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
          </motion.div>
          
          <motion.div 
            className="relative z-10 container-apple text-center space-y-8"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.p 
                className="text-sm font-semibold text-blue-600 tracking-wider uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Advanced Quadruped Robotics
              </motion.p>
              
              <h1 className="text-display bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                The Future of
                <br />
                Industrial Automation
              </h1>
              
              <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
                CHIRAL delivers cutting-edge robotic solutions engineered for the world's most demanding industrial environments. Experience unmatched performance, reliability, and intelligence.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link 
                to="/contact" 
                className="btn-apple btn-apple-primary group"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/products" 
                className="btn-apple btn-apple-secondary"
              >
                Explore Products
              </Link>
              <button className="btn-apple flex items-center gap-2 text-blue-600 hover:bg-gray-100">
                <Play className="h-5 w-5" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
          
          {/* Hero Product Showcase */}
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
          >
            <img
              src={x30Hero}
              alt="CHIRAL X30 Robot"
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </section>

        {/* Stats Section */}
        <AnimatedSection className="section-padding bg-gray-50">
          <div className="container-apple">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-display font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-body text-gray-600 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-caption text-green-600 font-medium">
                    {stat.trend}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Products Section - Apple Store Style */}
        <AnimatedSection className="section-padding">
          <div className="container-apple">
            <div className="text-center mb-16">
              <h2 className="text-headline mb-6">
                Explore Our Products
              </h2>
              <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
                Each robot in our lineup is meticulously engineered to deliver exceptional performance in specific industrial applications.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Link to={product.link} className="block">
                    <div className="product-card">
                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-caption-sm font-semibold text-white rounded-full bg-gradient-to-r ${product.color}`}>
                          {product.badge}
                        </span>
                      </div>
                      
                      {/* Product Image - Standardized size */}
                      <div className="image-container aspect-[4/3]">
                        <motion.img
                          src={product.image}
                          alt={`${product.title} - ${product.subtitle}`}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 space-y-4">
                        <div>
                          <h3 className="text-title-sm mb-1">{product.title}</h3>
                          <p className="text-subtitle text-blue-600">{product.subtitle}</p>
                        </div>
                        
                        <p className="text-body text-gray-600">
                          {product.description}
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          {product.features.map((feature, fIndex) => (
                            <div key={fIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-caption">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <div className="pt-4">
                          <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 transition-all">
                            <span className="text-body-sm">Learn More</span>
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Applications Section */}
        <AnimatedSection className="section-padding bg-gradient-to-b from-white to-gray-50">
          <div className="container-apple">
            <div className="text-center mb-16">
              <h2 className="text-headline mb-6">
                Transforming Industries
              </h2>
              <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
                Our robotic solutions are deployed across critical sectors, delivering unprecedented operational efficiency and safety.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {applications.map((app, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <div className="card-apple p-8 h-full hover-lift">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} p-4 mb-6`}>
                      <app.icon className="w-full h-full text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-title-sm mb-3">{app.title}</h3>
                    <p className="text-body text-gray-600 mb-6">
                      {app.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {app.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          <span className="text-caption">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section - Apple Style */}
        <AnimatedSection className="section-padding bg-black text-white">
          <div className="container-apple text-center space-y-8">
            <h2 className="text-headline">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-body-large text-gray-300 max-w-3xl mx-auto">
              Join leading enterprises worldwide who trust CHIRAL for their critical industrial automation needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="btn-apple bg-white text-black hover:bg-gray-100 group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/applications" 
                className="btn-apple border border-white text-white hover:bg-white hover:text-black transition-all"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  )
}

export default Home