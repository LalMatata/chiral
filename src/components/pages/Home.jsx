import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Target, CheckCircle } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Industrial Grade',
      description: 'Built for harsh industrial environments with IP65 protection'
    },
    {
      icon: Zap,
      title: 'Advanced AI',
      description: 'Powered by cutting-edge AI for autonomous navigation and inspection'
    },
    {
      icon: Target,
      title: 'Precision Control',
      description: 'Millimeter-level accuracy for critical inspection tasks'
    }
  ]

  const benefits = [
    'Reduce inspection costs by up to 70%',
    'Eliminate safety risks for human workers',
    'Continuous 24/7 monitoring capability',
    'Real-time data collection and analysis',
    'Easy integration with existing systems'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Next-Generation
                <span className="text-blue-600 block">Quadruped Robots</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your industrial operations with CHIRAL's advanced quadruped robots. 
                Designed for autonomous inspection, monitoring, and data collection in challenging environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Request Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  View Products
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <img
                  src="/assets/images/robot-hero.jpg"
                  alt="CHIRAL Quadruped Robot"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CHIRAL Robots?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our quadruped robots combine advanced AI, robust engineering, and intuitive operation 
              to deliver unmatched performance in industrial applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Operations
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                CHIRAL quadruped robots deliver measurable ROI through reduced costs, 
                improved safety, and enhanced operational efficiency.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
                    <div className="text-sm text-gray-600">Cost Reduction</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Operation Time</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                    <div className="text-sm text-gray-600">Safety Incidents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get a customized quote for your specific industrial needs. 
            Our experts will help you choose the right solution.
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Your Quote Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

