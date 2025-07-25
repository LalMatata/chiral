import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Shield, Settings, Search, Factory, Building, Microscope } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

// Import images
import industrialFacility from '../../assets/images/applications/industrial-facility.jpg'
import intelIsrael from '../../assets/images/applications/intel-israel.jpg'
import x30Action from '../../assets/images/products/x30-action.jpg'
import x20Terrain from '../../assets/images/products/x20-terrain.jpg'

const Applications = () => {
  const { t, isRTL } = useLanguage()

  const applications = [
    {
      id: 'power-utilities',
      title: t('applications.powerTitle'),
      description: t('applications.powerDescription'),
      icon: Zap,
      image: industrialFacility,
      color: 'bg-yellow-500',
      details: {
        overview: 'Israel\'s power infrastructure is critical to national security and economic prosperity. CHIRAL\'s robotic solutions transform power infrastructure management by providing automated, comprehensive, and safe inspection capabilities.',
        useCases: [
          'Power plant equipment inspections',
          'Transmission line monitoring',
          'Distribution network assessment',
          'Thermal monitoring and analysis',
          'Gas leak detection',
          'Equipment condition monitoring'
        ],
        benefits: [
          '75% reduction in human exposure to hazardous environments',
          '40% improvement in inspection frequency and coverage',
          '25% reduction in unplanned maintenance events',
          'Enhanced compliance with safety regulations',
          'Real-time monitoring capabilities',
          'Predictive maintenance insights'
        ],
        recommendedProducts: ['X30 Series', 'X20 Series'],
        caseStudy: 'Israel Electric Corporation deployed CHIRAL X30 systems across thermal power generation facilities, achieving 75% reduction in human exposure to hazardous conditions while improving inspection coverage by 40%.'
      }
    },
    {
      id: 'security-surveillance',
      title: t('applications.securityTitle'),
      description: t('applications.securityDescription'),
      icon: Shield,
      image: intelIsrael,
      color: 'bg-blue-500',
      details: {
        overview: 'Security remains paramount for Israeli enterprises, particularly those operating critical infrastructure. CHIRAL\'s quadruped robots provide advanced surveillance capabilities that complement traditional security measures.',
        useCases: [
          'Perimeter security patrols',
          'Critical infrastructure protection',
          'Emergency response support',
          'Threat detection and assessment',
          'Access control monitoring',
          'Incident documentation'
        ],
        benefits: [
          '24/7 autonomous security coverage',
          '45% improvement in perimeter monitoring effectiveness',
          'Reduced security personnel exposure to outdoor conditions',
          'Enhanced emergency response capabilities',
          'Real-time threat assessment',
          'Integrated security system compatibility'
        ],
        recommendedProducts: ['X20 Series', 'X30 Series'],
        caseStudy: 'Israel Aerospace Industries implemented CHIRAL X20 systems for comprehensive facility security, achieving 24/7 autonomous coverage and 45% improvement in monitoring effectiveness.'
      }
    },
    {
      id: 'industrial-inspection',
      title: t('applications.industrialTitle'),
      description: t('applications.industrialDescription'),
      icon: Settings,
      image: x30Action,
      color: 'bg-green-500',
      details: {
        overview: 'Industrial facilities across Israel require regular inspections to ensure safe operation, regulatory compliance, and optimal performance. CHIRAL\'s robotic solutions revolutionize industrial inspection capabilities.',
        useCases: [
          'Chemical processing facility inspections',
          'Manufacturing equipment monitoring',
          'Confined space assessments',
          'Environmental monitoring',
          'Quality control inspections',
          'Maintenance support operations'
        ],
        benefits: [
          '60% improvement in hazardous area inspection coverage',
          '50% reduction in safety incidents during inspections',
          '30% improvement in early detection of equipment anomalies',
          'Enhanced regulatory compliance documentation',
          'Reduced operational downtime',
          'Improved worker safety'
        ],
        recommendedProducts: ['X20 Series', 'X30 Series'],
        caseStudy: 'Haifa Chemicals deployed CHIRAL robotic systems for ammonia production facility inspections, achieving 60% improvement in hazardous area coverage and 50% reduction in safety incidents.'
      }
    },
    {
      id: 'research-development',
      title: t('applications.researchTitle'),
      description: t('applications.researchDescription'),
      icon: Search,
      image: x20Terrain,
      color: 'bg-purple-500',
      details: {
        overview: 'Israel\'s reputation as a global technology leader is built on continuous innovation and research excellence. CHIRAL\'s robotic platforms provide researchers with access to advanced robotic systems.',
        useCases: [
          'Academic research projects',
          'Technology development and testing',
          'Algorithm development and validation',
          'Student training and education',
          'Innovation project support',
          'Technology transfer initiatives'
        ],
        benefits: [
          'Accelerated research project timelines',
          'Enhanced student learning experiences',
          'Multiple published research opportunities',
          'Successful technology transfer initiatives',
          'Reduced development costs',
          'Flexible customization options'
        ],
        recommendedProducts: ['Lite3 Series', 'X20 Series'],
        caseStudy: 'Technion Robotics Research Laboratory utilized CHIRAL Lite3 platforms to accelerate research timelines by 30% while enhancing student engagement and achieving multiple published research outcomes.'
      }
    }
  ]

  const industries = [
    {
      name: 'Power & Energy',
      icon: Zap,
      description: 'Power plants, transmission lines, renewable energy facilities',
      applications: ['Equipment inspections', 'Thermal monitoring', 'Safety assessments']
    },
    {
      name: 'Manufacturing',
      icon: Factory,
      description: 'Chemical plants, automotive, aerospace, electronics',
      applications: ['Quality control', 'Process monitoring', 'Maintenance support']
    },
    {
      name: 'Infrastructure',
      icon: Building,
      description: 'Transportation, water treatment, telecommunications',
      applications: ['Asset monitoring', 'Security patrols', 'Emergency response']
    },
    {
      name: 'Research & Education',
      icon: Microscope,
      description: 'Universities, research institutes, technology companies',
      applications: ['Algorithm development', 'Student training', 'Innovation projects']
    }
  ]

  const [selectedApplication, setSelectedApplication] = React.useState(applications[0])

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            {t('applications.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('applications.subtitle')}
          </p>
        </div>

        {/* Application Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {applications.map((application) => (
            <Card 
              key={application.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedApplication.id === application.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedApplication(application)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={application.image}
                  alt={application.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className={`p-2 rounded-lg ${application.color}`}>
                    <application.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{application.title}</CardTitle>
                <CardDescription>{application.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Detailed Application View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${selectedApplication.color}`}>
                  <selectedApplication.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  {selectedApplication.title}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {selectedApplication.details.overview}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Key Use Cases</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedApplication.details.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${selectedApplication.color}`} />
                    <span className="text-sm text-muted-foreground">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>
              <div className="flex flex-wrap gap-2">
                {selectedApplication.details.recommendedProducts.map((product, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedApplication.details.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedApplication.details.caseStudy}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Industries Overview */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Industries We Serve
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <industry.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{industry.name}</CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {industry.applications.map((app, appIndex) => (
                      <div key={appIndex} className="text-sm text-muted-foreground">
                        • {app}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Process */}
        <div className="bg-muted/50 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Implementation Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Assessment', description: 'Comprehensive evaluation of your operational requirements and challenges' },
              { step: '02', title: 'Design', description: 'Custom solution design tailored to your specific needs and environment' },
              { step: '03', title: 'Deployment', description: 'Professional installation and system integration with comprehensive testing' },
              { step: '04', title: 'Support', description: 'Ongoing training, maintenance, and optimization for maximum performance' }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover how CHIRAL's robotic solutions can address your specific operational challenges and deliver measurable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                {t('nav.requestDemo')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/products">View Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Applications

