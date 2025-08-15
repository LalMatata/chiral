import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, ChevronLeft, ChevronRight, Zap, Shield, Settings, Cpu, Mountain, Clock } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import AnimatedPage from '../AnimatedPage'

// Import images
import x30Hero from '../../assets/images/products/x30-hero.png'
import x30Action from '../../assets/images/products/x30-action.jpg'
import x20Main from '../../assets/images/products/x20-main.jpg'
import x20Terrain from '../../assets/images/products/x20-terrain.jpg'
import lite3Main from '../../assets/images/products/lite3-main.png'
import lite3Detailed from '../../assets/images/products/lite3-detailed.jpg'

const Products = () => {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState({})
  const [imageLoadingStates, setImageLoadingStates] = useState({})

  // Get product data from LanguageContext
  const homeData = t('home')
  const productsData = t('products')
  const productItems = homeData?.products?.items || []

  // Handle image loading states
  const handleImageLoad = (imageKey) => {
    setImageLoadingStates(prev => ({ ...prev, [imageKey]: false }))
  }

  const handleImageError = (imageKey) => {
    setImageLoadingStates(prev => ({ ...prev, [imageKey]: false }))
  }

  const setImageLoading = (imageKey, loading = true) => {
    setImageLoadingStates(prev => ({ ...prev, [imageKey]: loading }))
  }

  // Map product data with images and icons
  const imageMap = {
    'X30 Series': [x30Hero, x30Action],
    'X20 Series': [x20Main, x20Terrain], 
    'Lite3 Series': [lite3Main, lite3Detailed]
  }

  const iconMap = {
    'X30 Series': Shield,
    'X20 Series': Settings,
    'Lite3 Series': Cpu
  }

  const colorMap = {
    'X30 Series': 'from-blue-600 to-cyan-500',
    'X20 Series': 'from-purple-600 to-pink-500',
    'Lite3 Series': 'from-green-600 to-teal-500'
  }

  const products = productItems.map((item, index) => ({
    id: item.title.toLowerCase().replace(/\s+/g, '').replace('series', ''),
    name: item.title,
    tagline: item.subtitle,
    description: item.description,
    badge: item.badge,
    featured: item.badge === 'Most Popular' || item.badge === 'Most Advanced',
    images: imageMap[item.title] || [x30Hero],
    color: colorMap[item.title] || 'from-blue-600 to-cyan-500',
    icon: iconMap[item.title] || Shield,
    features: item.features || [],
    specifications: item.specs || {},
    pricing: item.pricing || 'Contact for Pricing'
  }))

  const AnimatedSection = ({ children, className = "" }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  const nextImage = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    const currentIndex = activeImageIndex[productId] || 0
    const nextIndex = (currentIndex + 1) % product.images.length
    setActiveImageIndex({ ...activeImageIndex, [productId]: nextIndex })
  }

  const prevImage = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    const currentIndex = activeImageIndex[productId] || 0
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1
    setActiveImageIndex({ ...activeImageIndex, [productId]: prevIndex })
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 text-center space-y-6">
            <motion.p 
              className="text-sm font-semibold text-blue-600 tracking-wider uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {productsData?.hero?.subtitle || 'Our Product Lineup'}
            </motion.p>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {homeData?.products?.title || 'Choose Your Perfect Robotic Solution'}
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {homeData?.products?.subtitle || 'Three distinct product lines, each engineered to address specific operational requirements and deliver exceptional value.'}
            </motion.p>
          </div>
        </section>

        {/* Interactive Product Showcase */}
        <AnimatedSection className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
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
            {products.length > 0 && (
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
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                      <motion.img
                        src={products[selectedProduct].images[activeImageIndex[products[selectedProduct].id] || 0]}
                        alt={`${products[selectedProduct].name} - ${products[selectedProduct].tagline}`}
                        className="w-full h-full object-cover"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onLoad={() => handleImageLoad(`main-${products[selectedProduct].id}-${activeImageIndex[products[selectedProduct].id] || 0}`)}
                        onError={() => handleImageError(`main-${products[selectedProduct].id}-${activeImageIndex[products[selectedProduct].id] || 0}`)}
                        onLoadStart={() => setImageLoading(`main-${products[selectedProduct].id}-${activeImageIndex[products[selectedProduct].id] || 0}`, true)}
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
                            {products[selectedProduct].badge}
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
                      <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                        {products[selectedProduct].name}
                      </h2>
                      <p className="text-xl text-blue-600 mb-4">
                        {products[selectedProduct].tagline}
                      </p>
                      <p className="text-lg text-gray-600">
                        {products[selectedProduct].description}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Key Features</h3>
                      <div className="space-y-2">
                        {products[selectedProduct].features.slice(0, 4).map((feature, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        to={`/products/${products[selectedProduct].id}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors group"
                      >
                        View Full Details
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        to="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Request Information
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </AnimatedSection>

        {/* Comparison Section */}
        <AnimatedSection className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {homeData?.products?.comparison?.title || 'Compare Our Solutions'}
              </h2>
              <p className="text-xl text-gray-600">
                {homeData?.products?.comparison?.subtitle || 'Find the perfect match for your operational requirements.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} p-3 mb-6`}>
                    <product.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{product.pricing}</p>
                  
                  <div className="space-y-3 mb-6">
                    {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/products/${product.id}`}
                    className="flex items-center justify-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
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
        <AnimatedSection className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {homeData?.products?.support?.subtitle || 'Our robotics experts are standing by to help you select and implement the perfect solution for your needs.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors group"
              >
                Get Expert Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/applications" 
                className="inline-flex items-center justify-center px-8 py-4 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-all"
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