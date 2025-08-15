import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Mail, Send, Building2, User, Mail as MailIcon, MessageSquare, Target, Calendar, Shield } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { apiRequest, useErrorHandler, createValidationError } from '../../utils/errorHandler'
import { InlineLoading } from '../ui/LoadingComponents'
import AnimatedPage from '../AnimatedPage'

const Contact = () => {
  const { t, currentLanguage } = useLanguage()
  const { handleError } = useErrorHandler(currentLanguage)
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
      title: t('contact.form.steps.0.title'),
      subtitle: t('contact.form.steps.0.subtitle'),
      icon: Building2,
      fields: ['companyName', 'contactPerson', 'role']
    },
    {
      id: 2,
      title: t('contact.form.steps.1.title'),
      subtitle: t('contact.form.steps.1.subtitle'),
      icon: MailIcon,
      fields: ['email', 'phone', 'location']
    },
    {
      id: 3,
      title: t('contact.form.steps.2.title'),
      subtitle: t('contact.form.steps.2.subtitle'),
      icon: Target,
      fields: ['industry', 'projectType', 'timeline', 'budget']
    },
    {
      id: 4,
      title: t('contact.form.steps.3.title'),
      subtitle: t('contact.form.steps.3.subtitle'),
      icon: MessageSquare,
      fields: ['message', 'specificNeeds', 'preferredContact']
    }
  ]

  const industries = t('contact.form.options.industries')
  const projectTypes = t('contact.form.options.projectTypes')
  const timelines = t('contact.form.options.timelines')
  const budgetRanges = t('contact.form.options.budgets')
  const specificNeedsOptions = t('contact.form.options.needs')

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.info.1.title'),
      value: t('contact.info.1.value'),
      description: t('contact.info.1.description')
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    setFormSuccess(false)

    try {
      // Enhanced validation
      if (!validateEmail(formData.email)) {
        throw createValidationError('email', t('contact.form.validation.email'), formData.email)
      }

      await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          formType: 'multi-step-lead',
          productInterest,
          timestamp: new Date().toISOString(),
          source: 'website-contact-form'
        })
      })

      setFormSuccess(true)

      // Enhanced tracking for successful form submission
      if (window.gtag) {
        window.gtag('event', 'form_submission', {
          event_category: 'lead_generation',
          event_label: 'multi_step_contact',
          value: 5000
        })
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
      const { userMessage } = handleError(error, {
        form: 'contact',
        step: currentStep,
        formData: { ...formData, email: '***', phone: '***' } // Redact sensitive data
      })
      setFormError(userMessage)
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                {t('contact.form.fields.companyName')} *
              </label>
              <input
                id="company-name"
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('contact.form.placeholders.companyName')}
                required
                aria-describedby="company-name-help"
              />
              <div id="company-name-help" className="sr-only">
                Enter the name of your company or organization
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label htmlFor="contact-person" className="block text-sm font-medium text-gray-700">
                  {t('contact.form.fields.contactPerson')} *
                </label>
                <input
                  id="contact-person"
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('contact.form.placeholders.contactPerson')}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.fields.role')}
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('contact.form.placeholders.role')}
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
                  {t('contact.form.fields.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('contact.form.placeholders.email')}
                />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.fields.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('contact.form.placeholders.phone')}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('contact.form.fields.location')}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('contact.form.placeholders.location')}
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
                  {t('contact.form.fields.industry')} *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select your industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.fields.projectType')} *
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                  {t('contact.form.fields.timeline')}
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.fields.budget')}
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                {t('contact.form.fields.message')} *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('contact.form.placeholders.message')}
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('contact.form.fields.specificNeeds')}
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
                      className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{need}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('contact.form.fields.preferredContact')}
              </label>
              <div className="flex gap-4">
                {t('contact.form.options.contact').map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={formData.preferredContact === method}
                      onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
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
              className="text-sm font-semibold icon-primary tracking-wider uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('contact.hero.tagline')}
            </motion.p>
            
            <motion.h1 
              className="text-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('contact.hero.title')}
            </motion.h1>
            
            <motion.p 
              className="text-body-large text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('contact.hero.subtitle')}
            </motion.p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <AnimatedSection className="pb-16">
          <div className="container-apple">
            <div className="flex justify-center">
              <motion.div
                className="card-apple p-8 text-center hover-lift max-w-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl p-4 mx-auto mb-6">
                  <Mail className="w-full h-full icon-primary" />
                </div>
                <h3 className="text-title mb-2">{contactInfo[0].title}</h3>
                <p className="text-body-large text-gray-900 mb-2">{contactInfo[0].value}</p>
                <p className="text-body text-gray-500">{contactInfo[0].description}</p>
              </motion.div>
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
                        step.id <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.id < currentStep ? (
                          <CheckCircle className="h-5 w-5 icon-success" />
                        ) : (
                          <step.icon className="h-5 w-5 icon-on-primary" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-12 h-1 mx-2 transition-all ${
                          step.id < currentStep ? 'bg-primary' : 'bg-gray-200'
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
                      <div className="w-16 h-16 bg-gray-50 rounded-full p-4 mx-auto mb-6">
                        <CheckCircle className="w-full h-full icon-success" />
                      </div>
                      <h3 className="text-title font-bold mb-4">{t('contact.form.success.title')}</h3>
                      <p className="text-body text-gray-600 mb-6">
                        {t('contact.form.success.subtitle')}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4 icon-secondary" />
                        {t('contact.form.success.security')}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {renderStepContent()}
                      
                      {formError && (
                        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 icon-error flex-shrink-0" />
                          <p className="text-gray-700">{formError}</p>
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
                          {t('contact.form.buttons.previous')}
                        </button>
                        
                        {currentStep === totalSteps ? (
                          <button
                            type="submit"
                            disabled={!isStepValid(currentStep) || formLoading}
                            className="btn-apple btn-apple-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={formLoading ? 'Submitting your request' : 'Submit your contact request'}
                          >
                            {formLoading ? (
                              <div className="flex items-center gap-2">
                                <InlineLoading size="sm" showMessage={false} />
                                {t('contact.form.buttons.submitting')}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                {t('contact.form.buttons.submit')}
                                <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStepValid(currentStep)}
                            className="btn-apple btn-apple-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Go to next step"
                          >
                            {t('contact.form.buttons.next')}
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