import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLanguage } from '../contexts/LanguageContext'
import { CheckCircle, Send, Building, Users, Calendar, Phone, Mail, MapPin } from 'lucide-react'

const LeadCaptureForm = ({ formType = 'demo', onSubmit, className = '' }) => {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    
    // Company Information
    industry: '',
    companySize: '',
    location: '',
    
    // Project Information
    applicationArea: '',
    projectTimeline: '',
    budget: '',
    currentSolution: '',
    
    // Specific Requirements
    requirements: '',
    challenges: '',
    
    // Preferences
    preferredContactMethod: 'email',
    preferredLanguage: 'english',
    
    // Consent
    marketingConsent: false,
    privacyConsent: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const industries = [
    { value: 'power-utilities', label: 'Power & Utilities' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'security-defense', label: 'Security & Defense' },
    { value: 'research-education', label: 'Research & Education' },
    { value: 'oil-gas', label: 'Oil & Gas' },
    { value: 'mining', label: 'Mining' },
    { value: 'construction', label: 'Construction' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'other', label: 'Other' }
  ]

  const companySizes = [
    { value: 'startup', label: '1-10 employees' },
    { value: 'small', label: '11-50 employees' },
    { value: 'medium', label: '51-200 employees' },
    { value: 'large', label: '201-1000 employees' },
    { value: 'enterprise', label: '1000+ employees' }
  ]

  const applicationAreas = [
    { value: 'inspection', label: 'Facility Inspection' },
    { value: 'patrol', label: 'Security Patrol' },
    { value: 'monitoring', label: 'Environmental Monitoring' },
    { value: 'maintenance', label: 'Predictive Maintenance' },
    { value: 'surveillance', label: 'Perimeter Surveillance' },
    { value: 'research', label: 'Research & Development' },
    { value: 'training', label: 'Training & Education' },
    { value: 'other', label: 'Other Applications' }
  ]

  const projectTimelines = [
    { value: 'immediate', label: 'Immediate (0-3 months)' },
    { value: 'short', label: 'Short-term (3-6 months)' },
    { value: 'medium', label: 'Medium-term (6-12 months)' },
    { value: 'long', label: 'Long-term (12+ months)' },
    { value: 'exploring', label: 'Just exploring options' }
  ]

  const budgetRanges = [
    { value: 'under-50k', label: 'Under $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-250k', label: '$100,000 - $250,000' },
    { value: '250k-500k', label: '$250,000 - $500,000' },
    { value: 'over-500k', label: 'Over $500,000' },
    { value: 'not-determined', label: 'Not yet determined' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    if (!formData.industry) newErrors.industry = 'Industry selection is required'
    if (!formData.privacyConsent) newErrors.privacyConsent = 'Privacy policy consent is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Phone validation (if provided)
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Add form metadata
      const submissionData = {
        ...formData,
        formType,
        submissionDate: new Date().toISOString(),
        source: 'website',
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
      
      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Track conversion event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
          value: 1.0,
          currency: 'USD'
        })
      }
      
      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(submissionData)
      }
      
      setIsSubmitted(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          jobTitle: '',
          company: '',
          industry: '',
          companySize: '',
          location: '',
          applicationArea: '',
          projectTimeline: '',
          budget: '',
          currentSolution: '',
          requirements: '',
          challenges: '',
          preferredContactMethod: 'email',
          preferredLanguage: 'english',
          marketingConsent: false,
          privacyConsent: false
        })
      }, 3000)
      
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ submit: 'There was an error submitting the form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {formType === 'demo' ? 'Demo Request Submitted!' : 'Thank You for Your Interest!'}
          </h3>
          <p className="text-gray-600 mb-4">
            We've received your request and will contact you within 24 hours to schedule your personalized demonstration.
          </p>
          <p className="text-sm text-gray-500">
            Check your email for confirmation details and next steps.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {formType === 'demo' ? 'Request a Personalized Demo' : 'Get More Information'}
        </CardTitle>
        <CardDescription>
          {formType === 'demo' 
            ? 'See CHIRAL\'s quadruped robots in action. Schedule a demonstration tailored to your specific needs.'
            : 'Learn how CHIRAL\'s robotics solutions can transform your operations.'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="your.email@company.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
                placeholder="+972-XX-XXX-XXXX"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="e.g., Operations Manager"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={errors.company ? 'border-red-500' : ''}
                placeholder="Your company name"
              />
              {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          {/* Project Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationArea">Primary Application Area</Label>
              <Select value={formData.applicationArea} onValueChange={(value) => handleInputChange('applicationArea', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application area" />
                </SelectTrigger>
                <SelectContent>
                  {applicationAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectTimeline">Project Timeline</Label>
              <Select value={formData.projectTimeline} onValueChange={(value) => handleInputChange('projectTimeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {projectTimelines.map((timeline) => (
                    <SelectItem key={timeline.value} value={timeline.value}>
                      {timeline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Estimated Budget Range</Label>
            <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((budget) => (
                  <SelectItem key={budget.value} value={budget.value}>
                    {budget.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentSolution">Current Solution (if any)</Label>
            <Input
              id="currentSolution"
              value={formData.currentSolution}
              onChange={(e) => handleInputChange('currentSolution', e.target.value)}
              placeholder="Describe your current approach or solution"
            />
          </div>

          {/* Specific Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Specific Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Describe your specific requirements, environment conditions, or technical needs..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Current Challenges</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => handleInputChange('challenges', e.target.value)}
              placeholder="What challenges are you trying to solve with robotics automation?"
              rows={3}
            />
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <Label>Preferred Contact Method</Label>
            <RadioGroup 
              value={formData.preferredContactMethod} 
              onValueChange={(value) => handleInputChange('preferredContactMethod', value)}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="contact-email" />
                <Label htmlFor="contact-email" className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="contact-phone" />
                <Label htmlFor="contact-phone" className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Preferred Language</Label>
            <RadioGroup 
              value={formData.preferredLanguage} 
              onValueChange={(value) => handleInputChange('preferredLanguage', value)}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="lang-english" />
                <Label htmlFor="lang-english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hebrew" id="lang-hebrew" />
                <Label htmlFor="lang-hebrew">עברית (Hebrew)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Consent */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="marketingConsent"
                checked={formData.marketingConsent}
                onCheckedChange={(checked) => handleInputChange('marketingConsent', checked)}
              />
              <Label htmlFor="marketingConsent" className="text-sm leading-relaxed">
                I would like to receive updates about CHIRAL's products, industry insights, and relevant content via email.
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) => handleInputChange('privacyConsent', checked)}
                className={errors.privacyConsent ? 'border-red-500' : ''}
              />
              <Label htmlFor="privacyConsent" className="text-sm leading-relaxed">
                I agree to CHIRAL's <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> and consent to the processing of my personal data for the purpose of this inquiry. *
              </Label>
            </div>
            {errors.privacyConsent && <p className="text-sm text-red-500">{errors.privacyConsent}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {errors.submit && (
              <p className="text-sm text-red-500 mb-4">{errors.submit}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>{formType === 'demo' ? 'Request Demo' : 'Submit Inquiry'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default LeadCaptureForm

