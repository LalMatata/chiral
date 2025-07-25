import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Calendar, Download } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

const Contact = () => {
  const { t, isRTL } = useLanguage()
  const [demoForm, setDemoForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    application: '',
    attendees: '',
    preferredDate: '',
    requirements: ''
  })

  const [salesForm, setSalesForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    currentChallenges: '',
    budget: '',
    timeline: '',
    technicalRequirements: '',
    supportNeeds: ''
  })

  const handleDemoSubmit = (e) => {
    e.preventDefault()
    // Handle demo form submission
    console.log('Demo form submitted:', demoForm)
    alert('Demo request submitted successfully! We will contact you within 24 hours.')
  }

  const handleSalesSubmit = (e) => {
    e.preventDefault()
    // Handle sales form submission
    console.log('Sales form submitted:', salesForm)
    alert('Sales inquiry submitted successfully! Our team will respond within 24 hours.')
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Headquarters',
      details: [
        'CHIRAL Robotics Solutions Ltd.',
        'Technology Park, Tel Aviv, Israel',
        'Building 15, Floor 3'
      ]
    },
    {
      icon: Phone,
      title: 'Phone',
      details: [
        'Main: +972-3-XXX-XXXX',
        'Sales: +972-3-XXX-XXXX',
        'Support: +972-3-XXX-XXXX',
        'Emergency: +972-5X-XXX-XXXX (24/7)'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@chiral-robotics.co.il',
        'sales@chiral-robotics.co.il',
        'support@chiral-robotics.co.il',
        'partnerships@chiral-robotics.co.il'
      ]
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        'Sunday - Thursday: 8:00 AM - 6:00 PM',
        'Friday: 8:00 AM - 2:00 PM',
        'Saturday: Closed',
        'Emergency Support: 24/7'
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

  const applications = [
    'Equipment Inspection',
    'Security Patrol',
    'Environmental Monitoring',
    'Emergency Response',
    'Research & Development',
    'Training & Education',
    'Other'
  ]

  const budgetRanges = [
    'Under $100K',
    '$100K - $250K',
    '$250K - $500K',
    '$500K - $1M',
    'Over $1M',
    'To be discussed'
  ]

  const timelines = [
    'Immediate (1-3 months)',
    'Short-term (3-6 months)',
    'Medium-term (6-12 months)',
    'Long-term (12+ months)',
    'Planning phase'
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
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

        {/* Contact Forms */}
        <Tabs defaultValue="demo" className="mb-20">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{t('contact.demoTitle')}</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>{t('contact.salesTitle')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact.demoTitle')}</CardTitle>
                <CardDescription className="text-base">
                  {t('contact.demoDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDemoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="demo-company">{t('contact.companyName')} *</Label>
                      <Input
                        id="demo-company"
                        value={demoForm.companyName}
                        onChange={(e) => setDemoForm({...demoForm, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo-contact">{t('contact.contactPerson')} *</Label>
                      <Input
                        id="demo-contact"
                        value={demoForm.contactPerson}
                        onChange={(e) => setDemoForm({...demoForm, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="demo-email">{t('contact.email')} *</Label>
                      <Input
                        id="demo-email"
                        type="email"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo-phone">{t('contact.phone')} *</Label>
                      <Input
                        id="demo-phone"
                        type="tel"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="demo-industry">{t('contact.industry')} *</Label>
                      <Select value={demoForm.industry} onValueChange={(value) => setDemoForm({...demoForm, industry: value})}>
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
                      <Label htmlFor="demo-application">Application Interest</Label>
                      <Select value={demoForm.application} onValueChange={(value) => setDemoForm({...demoForm, application: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select application" />
                        </SelectTrigger>
                        <SelectContent>
                          {applications.map((application) => (
                            <SelectItem key={application} value={application}>
                              {application}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="demo-attendees">Number of Attendees</Label>
                      <Input
                        id="demo-attendees"
                        type="number"
                        min="1"
                        max="20"
                        value={demoForm.attendees}
                        onChange={(e) => setDemoForm({...demoForm, attendees: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo-date">Preferred Date</Label>
                      <Input
                        id="demo-date"
                        type="date"
                        value={demoForm.preferredDate}
                        onChange={(e) => setDemoForm({...demoForm, preferredDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demo-requirements">Special Requirements or Questions</Label>
                    <Textarea
                      id="demo-requirements"
                      rows={4}
                      value={demoForm.requirements}
                      onChange={(e) => setDemoForm({...demoForm, requirements: e.target.value})}
                      placeholder="Please describe any specific requirements, questions, or areas of interest for the demonstration..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className={`h-5 w-5 ${isRTL ? 'ml-2 mr-0' : 'mr-2'}`} />
                    {t('contact.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact.salesTitle')}</CardTitle>
                <CardDescription className="text-base">
                  {t('contact.salesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalesSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sales-company">{t('contact.companyName')} *</Label>
                      <Input
                        id="sales-company"
                        value={salesForm.companyName}
                        onChange={(e) => setSalesForm({...salesForm, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sales-contact">{t('contact.contactPerson')} *</Label>
                      <Input
                        id="sales-contact"
                        value={salesForm.contactPerson}
                        onChange={(e) => setSalesForm({...salesForm, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sales-email">{t('contact.email')} *</Label>
                      <Input
                        id="sales-email"
                        type="email"
                        value={salesForm.email}
                        onChange={(e) => setSalesForm({...salesForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sales-phone">{t('contact.phone')} *</Label>
                      <Input
                        id="sales-phone"
                        type="tel"
                        value={salesForm.phone}
                        onChange={(e) => setSalesForm({...salesForm, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sales-industry">{t('contact.industry')} *</Label>
                    <Select value={salesForm.industry} onValueChange={(value) => setSalesForm({...salesForm, industry: value})}>
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
                    <Label htmlFor="sales-challenges">Current Challenges or Needs *</Label>
                    <Textarea
                      id="sales-challenges"
                      rows={3}
                      value={salesForm.currentChallenges}
                      onChange={(e) => setSalesForm({...salesForm, currentChallenges: e.target.value})}
                      placeholder="Please describe your current operational challenges or specific needs..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sales-budget">Budget Considerations</Label>
                      <Select value={salesForm.budget} onValueChange={(value) => setSalesForm({...salesForm, budget: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sales-timeline">Implementation Timeline</Label>
                      <Select value={salesForm.timeline} onValueChange={(value) => setSalesForm({...salesForm, timeline: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((timeline) => (
                            <SelectItem key={timeline} value={timeline}>
                              {timeline}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sales-technical">Technical Requirements</Label>
                    <Textarea
                      id="sales-technical"
                      rows={3}
                      value={salesForm.technicalRequirements}
                      onChange={(e) => setSalesForm({...salesForm, technicalRequirements: e.target.value})}
                      placeholder="Please describe any specific technical requirements or environmental conditions..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sales-support">Support Needs</Label>
                    <Textarea
                      id="sales-support"
                      rows={3}
                      value={salesForm.supportNeeds}
                      onChange={(e) => setSalesForm({...salesForm, supportNeeds: e.target.value})}
                      placeholder="Please describe your expected support requirements (training, maintenance, etc.)..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className={`h-5 w-5 ${isRTL ? 'ml-2 mr-0' : 'mr-2'}`} />
                    {t('contact.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Channels */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            {t('contact.supportTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-500/10 rounded-lg w-fit">
                  <Phone className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Direct access to technical specialists for immediate assistance with urgent issues.
                </p>
                <Button variant="outline" className="w-full">
                  Call Support
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-500/10 rounded-lg w-fit">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive technical documentation and support request submission.
                </p>
                <Button variant="outline" className="w-full">
                  Email Support
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-lg w-fit">
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access technical documentation, user manuals, and training materials.
                </p>
                <Button variant="outline" className="w-full">
                  Download Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-muted/50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Visit Our Facilities
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Located in the heart of Tel Aviv's Technology Park, our facilities include demonstration centers, 
            training facilities, and comprehensive technical support capabilities.
          </p>
          <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-lg font-semibold">Interactive Map</p>
              <p className="text-muted-foreground">Technology Park, Tel Aviv, Israel</p>
            </div>
          </div>
          <Button size="lg">
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Contact

