import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Target, CheckCircle, Users, Building, Award, TrendingUp } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Industrial Grade',
      description: 'Built for harsh industrial environments with IP67 protection'
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

  const stats = [
    {
      number: '50+',
      label: 'Deployed Systems',
      description: 'Robotic systems successfully deployed across Israel',
      icon: Award
    },
    {
      number: '25+',
      label: 'Industrial Facilities',
      description: 'Major facilities served across multiple sectors',
      icon: Building
    },
    {
      number: '200+',
      label: 'Trained Personnel',
      description: 'Professionals trained on our robotic systems',
      icon: Users
    },
    {
      number: '99.9%',
      label: 'Uptime Reliability',
      description: 'System availability and performance record',
      icon: TrendingUp
    }
  ]

  const applications = [
    {
      title: 'Power & Utilities',
      description: 'Automated inspection capabilities for power plants, transmission lines, and distribution facilities.',
      image: '/assets/images/industrial-facility.jpg'
    },
    {
      title: 'Security & Surveillance',
      description: 'Advanced surveillance capabilities that complement traditional security measures.',
      image: '/assets/images/x30-action.jpg'
    },
    {
      title: 'Industrial Inspection',
      description: 'Automated inspection solutions for manufacturing facilities and processing centers.',
      image: '/assets/images/x20-terrain.jpg'
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
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Revolutionizing Industry with
                <span className="text-blue-300 block">Advanced Quadruped Robotics</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                CHIRAL brings cutting-edge robotic solutions to Israel's most demanding industrial environments. 
                From power utilities to security applications, our autonomous quadruped robots deliver unmatched 
                performance, reliability, and intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Request a Demo Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-blue-300 text-blue-100 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <img
                  src="/assets/images/x30-hero.png"
                  alt="CHIRAL Quadruped Robot"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CHIRAL for Your Industrial Robotics Needs?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              In Israel's rapidly evolving industrial landscape, staying ahead requires embracing the most advanced 
              technologies available. CHIRAL specializes in delivering state-of-the-art quadruped robotic solutions 
              specifically tailored for Israeli enterprises across power utilities, manufacturing, security, and research sectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</div>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Overview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Robotic Solutions for Every Industrial Challenge
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="/assets/images/x30-hero.png"
                  alt="X30 Series"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">X30 Series - Industrial Flagship</h3>
                <p className="text-gray-600 mb-4">
                  The pinnacle of industrial quadruped robotics, engineered for the most demanding operational environments.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-2" />
                    <span>IP67 Protection</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <span>4m/s Max Speed</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-blue-600 mr-2" />
                    <span>2.5-4h Endurance</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    <span>10km Range</span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="/assets/images/x20-main.jpg"
                  alt="X20 Series"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">X20 Series - Patrol & Inspection Specialist</h3>
                <p className="text-gray-600 mb-4">
                  Designed for comprehensive industrial patrol and inspection operations with exceptional mobility.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-2" />
                    <span>20kg Payload</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <span>IP66 Protection</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-blue-600 mr-2" />
                    <span>15km Range</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    <span>All-Terrain</span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src="/assets/images/lite3-main.png"
                  alt="Lite3 Series"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lite3 Series - Versatile Research Platform</h3>
                <p className="text-gray-600 mb-4">
                  An accessible entry point into advanced robotics for research institutions and smaller operations.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-2" />
                    <span>12kg Weight</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <span>40° Slope</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-blue-600 mr-2" />
                    <span>SDK Included</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Research Platform</span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Industry Across Critical Sectors
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {applications.map((application, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <div className="relative h-64">
                  <img
                    src={application.image}
                    alt={application.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{application.title}</h3>
                    <p className="text-sm text-gray-200">{application.description}</p>
                  </div>
                </div>
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
                Trusted by Leading Enterprises
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                CHIRAL has established itself as Israel's premier provider of industrial quadruped robotics solutions.
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
                    <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
                    <div className="text-sm text-gray-600">Hazard Reduction</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
                    <div className="text-sm text-gray-600">Coverage Improvement</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-2">25%</div>
                    <div className="text-sm text-gray-600">Maintenance Reduction</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Operation Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover how CHIRAL's advanced quadruped robotics can revolutionize your industrial operations. 
            Contact us today for a personalized demonstration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Request Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/applications"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
            >
              View Applications
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

