import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Phone, Mail, MapPin, Clock, Send, Building2, User, Mail as MailIcon, MessageSquare, Target, Calendar, Shield } from 'lucide-react'
import AnimatedPage from '../AnimatedPage'

const Contact = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [productInterest, setProductInterest] = useState('')
  
  const [formData, setFormData] = useState({
    // Step 1 - Company Info
    companyName: '',
    contactPerson: '',
    role: '',
    // Step 2 - Contact Details
    email: '',
    phone: '',
    location: '',
    // Step 3 - Project Details
    industry: '',
    projectType: '',
    timeline: '',
    budget: '',
    // Step 4 - Requirements
    message: '',
    specificNeeds: [],
    preferredContact: 'email'
  })

  const totalSteps = 4

  // Handle URL parameters for pre-filling forms
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const product = urlParams.get('product')
    
    if (product) {
      setProductInterest(product)
      const productMessages = {
        'x30': 'I\'m interested in the X30 Series robot for industrial applications.',
        'x20': 'I\'m interested in the X20 Series robot for patrol and inspection.',
        'lite3': 'I\'m interested in the Lite3 Series robot for research and development.'
      }
      setFormData(prev => ({
        ...prev,
        message: productMessages[product] || `I'm interested in the ${product} robot.`
      }))
    }
  }, [])

  const steps = [
    {
      id: 1,
      title: 'Company Information',
      subtitle: 'Tell us about your organization',
      icon: Building2,
      fields: ['companyName', 'contactPerson', 'role']
    },
    {
      id: 2,
      title: 'Contact Details',
      subtitle: 'How can we reach you?',
      icon: MailIcon,
      fields: ['email', 'phone', 'location']
    },
    {
      id: 3,
      title: 'Project Overview',
      subtitle: 'What are you looking to achieve?',
      icon: Target,
      fields: ['industry', 'projectType', 'timeline', 'budget']
    },
    {
      id: 4,
      title: 'Requirements',
      subtitle: 'Share your specific needs',
      icon: MessageSquare,
      fields: ['message', 'specificNeeds', 'preferredContact']
    }
  ]

  const industries = [
    'Power & Utilities',
    'Manufacturing', 
    'Chemical Processing',
    'Oil & Gas',
    'Mining',
    'Security & Defense',
    'Research & Education',
    'Construction',
    'Transportation',
    'Other'
  ]

  const projectTypes = [
    'Equipment Inspection',
    'Security Patrol',
    'Industrial Monitoring',
    'Research & Development',
    'Emergency Response',
    'Infrastructure Assessment',
    'Environmental Monitoring',
    'Custom Application'
  ]

  const timelines = [
    'Immediate (within 1 month)',
    'Short-term (1-3 months)',
    'Medium-term (3-6 months)',
    'Long-term (6+ months)',
    'Planning phase'
  ]

  const budgetRanges = [
    'Under $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M+',
    'To be discussed'
  ]

  const specificNeedsOptions = [
    'High-temperature operation',
    'Hazardous environment protection',
    'Extended battery life',
    'Custom sensor integration',
    'Real-time data streaming',
    'AI-powered analytics',
    '24/7 operation capability',
    'Multi-robot coordination'
  ]

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri 9am-6pm EST'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@chiral-robotics.com',
      description: 'We respond within 2 hours'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Tel Aviv, Israel',
      description: 'Serving customers globally'
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: '< 24 hours',
      description: 'Guaranteed response time'
    }
  ]

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step) => {
    const requiredFields = {
      1: ['companyName', 'contactPerson'],
      2: ['email'],
      3: ['industry', 'projectType'],
      4: ['message']
    }

    return requiredFields[step]?.every(field => formData[field]?.trim()) || false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    setFormSuccess(false)

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address.')
      setFormLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType: 'multi-step-lead',
          productInterest,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        let errorMessage = 'Failed to submit form'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || `Request failed with status ${response.status}`
        }
        throw new Error(errorMessage)
      }

      setFormSuccess(true)

      // Enhanced tracking for successful form submission
      if (window.trackLead) {
        window.trackLead('multi-step-contact', productInterest)
      }
      if (window.fbTrackLead) {
        window.fbTrackLead(5000) // Higher value for completed multi-step form
      }
      if (window.linkedinTrackLead) {
        window.linkedinTrackLead()
      }

      // Reset form
      setFormData({
        companyName: '',
        contactPerson: '',
        role: '',
        email: '',
        phone: '',
        location: '',
        industry: '',
        projectType: '',
        timeline: '',
        budget: '',
        message: '',
        specificNeeds: [],
        preferredContact: 'email'
      })
      setCurrentStep(1)

    } catch (error) {
      setFormError(error.message || 'Failed to submit form. Please try again or email us directly.')
      console.error('Form submission error:', error)
    } finally {
      setFormLoading(false)
    }
  }

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

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: [
        'Sales: +1-XXX-XXX-XXXX',
        'Support: +1-XXX-XXX-XXXX'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@chiralrobotics.com',
        'sales@chiralrobotics.com'
      ]
    }
  ]

  const industries = [
    'Power & Utilities',
    'Manufacturing', 
    'Chemical Processing',
    'Oil & Gas',
    'Mining',
    'Security & Defense',
    'Research & Education',
    'Other'
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            {formType === 'quote' ? 'Get Your Custom Quote' : 
             formType === 'demo' ? 'Schedule a Product Demo' : 
             'Get Information About Our Robotic Solutions'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {formType === 'quote' ? 'Tell us about your requirements and get a detailed quote within 24 hours.' :
             formType === 'demo' ? 'See our robots in action with a personalized demonstration.' :
             'Contact us to learn more about how CHIRAL\'s advanced quadruped robots can transform your operations.'}
          </p>
        </div>

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="company-name" className="block text-body-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                id="company-name"
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Your company name"
                required
                aria-describedby="company-name-help"
              />
              <div id="company-name-help" className="sr-only">
                Enter the name of your company or organization
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label htmlFor="contact-person" className="block text-body-sm font-medium text-gray-700">
                  Contact Person *
                </label>
                <input
                  id="contact-person"
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                  required
                  aria-describedby="contact-person-help"
                />
                <div id="contact-person-help" className="sr-only">
                  Enter your full name as the primary contact
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role/Title
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your role at the company"
                />
              </div>
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Location/Region
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="City, State/Country"
              />
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select your industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Type *
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Project Requirements *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Please describe your project requirements, challenges, and how our robotic solutions can help..."
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Specific Technical Needs (select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specificNeedsOptions.map((need) => (
                  <label key={need} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specificNeeds.includes(need)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.specificNeeds, need]
                          : formData.specificNeeds.filter(n => n !== need)
                        setFormData({...formData, specificNeeds: updated})
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{need}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              <div className="flex gap-4">
                {['email', 'phone', 'video-call'].map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={formData.preferredContact === method}
                      onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {method === 'video-call' ? 'Video Call' : method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="container-apple text-center space-y-6">
            <motion.p 
              className="text-sm font-semibold text-blue-600 tracking-wider uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get In Touch
            </motion.p>
            
            <motion.h1 
              className="text-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Start Your
              <br />
              <span className="gradient-text">Robotics Journey</span>
            </motion.h1>
            
            <motion.p 
              className="text-body-large text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Tell us about your project and discover how CHIRAL's advanced robotic solutions can transform your operations.
            </motion.p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <AnimatedSection className="pb-16">
          <div className="container-apple">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="card-apple p-6 text-center hover-lift"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl p-3 mx-auto mb-4">
                    <info.icon className="w-full h-full icon-secondary" />
                  </div>
                  <h3 className="text-subtitle mb-1">{info.title}</h3>
                  <p className="text-body text-gray-900 mb-1">{info.value}</p>
                  <p className="text-caption text-gray-500">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Multi-Step Form */}
        <AnimatedSection className="pb-16">
          <div className="container-apple max-w-4xl">
            <div className="card-apple p-8 lg:p-12">
              {/* Progress Steps */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-8">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        step.id <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.id < currentStep ? (
                          <CheckCircle className="h-5 w-5 icon-success" />
                        ) : (
                          <step.icon className="h-5 w-5 icon-on-primary" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-12 h-1 mx-2 transition-all ${
                          step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <h2 className="text-title mb-2">
                    Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-body text-gray-600">
                    {steps[currentStep - 1].subtitle}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {formSuccess ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full p-4 mx-auto mb-6">
                        <CheckCircle className="w-full h-full icon-success" />
                      </div>
                      <h3 className="text-title font-bold mb-4">Request Submitted Successfully!</h3>
                      <p className="text-body text-gray-600 mb-6">
                        Thank you for your interest in CHIRAL's robotic solutions. Our team will contact you within 24 hours to discuss your requirements.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4 icon-secondary" />
                        Your information is secure and will never be shared
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {renderStepContent()}
                      
                      {formError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 icon-error flex-shrink-0" />
                          <p className="text-red-700">{formError}</p>
                        </div>
                      )}
                      
                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-12">
                        <button
                          type="button"
                          onClick={prevStep}
                          disabled={currentStep === 1}
                          className={`btn-apple ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'btn-apple-secondary'}`}
                          aria-label="Go to previous step"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Previous
                        </button>
                        
                        {currentStep === totalSteps ? (
                          <button
                            type="submit"
                            disabled={!isStepValid(currentStep) || formLoading}
                            className="btn-apple btn-apple-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={formLoading ? 'Submitting your request' : 'Submit your contact request'}
                          >
                            {formLoading ? 'Submitting...' : 'Submit Request'}
                            <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStepValid(currentStep)}
                            className="btn-apple btn-apple-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Go to next step"
                          >
                            Next Step
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  )
}

export default Contact