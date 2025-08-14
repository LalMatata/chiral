import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const Contact = () => {
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [formType, setFormType] = useState('contact')
  const [productInterest, setProductInterest] = useState('')
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    message: ''
  })
  
  // Handle URL parameters for pre-filling forms
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const product = urlParams.get('product')
    const type = urlParams.get('type')
    
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
    
    if (type) {
      setFormType(type)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    setFormSuccess(false)
    
    // Client-side validation
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields.')
      setFormLoading(false)
      return
    }
    
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
          formType: 'lead',
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit form')
      }
      
      setFormSuccess(true)
      
      // Enhanced tracking for successful form submission
      if (window.trackLead) {
        window.trackLead(formType, productInterest);
      }
      if (window.fbTrackLead) {
        const leadValue = formType === 'quote' ? 2500 : formType === 'demo' ? 5000 : 1000
        window.fbTrackLead(leadValue);
      }
      if (window.linkedinTrackLead) {
        window.linkedinTrackLead();
      }
      
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        industry: '',
        message: ''
      })
      
      setTimeout(() => setFormSuccess(false), 5000)
    } catch (error) {
      setFormError(error.message || 'Failed to submit form. Please try again or email us directly.')
      console.error('Form submission error:', error)
    } finally {
      setFormLoading(false)
    }
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
        'info@chiral-robotics.com',
        'sales@chiral-robotics.com'
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

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Send Us Your Information Request</CardTitle>
            <CardDescription className="text-base">
              Fill out this form and our team will get back to you within 24 hours with detailed information about our robotic solutions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formSuccess && (
              <Alert className="mb-6 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Request submitted successfully! We'll contact you within 24 hours.
                </AlertDescription>
              </Alert>
            )}
            {formError && (
              <Alert className="mb-6 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {formError}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person *</Label>
                  <Input
                    id="contact"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Tell us about your needs *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Please describe your project requirements, challenges, or questions about our robotic solutions..."
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={formLoading}>
                {formLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {formLoading ? 'Submitting...' : 'Send Information Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Contact