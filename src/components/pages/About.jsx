import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Award, Users, Target, Lightbulb, Shield, Handshake } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

// Import images
import teamDiverse from '../../assets/images/company/team-diverse.jpg'
import teamMeeting from '../../assets/images/company/team-meeting.jpg'
import modernOffice from '../../assets/images/company/modern-office.jpg'
import officeInterior from '../../assets/images/company/office-interior.jpg'

const About = () => {
  const { t, isRTL } = useLanguage()

  const values = [
    {
      icon: Award,
      title: t('about.excellence'),
      description: t('about.excellenceText'),
      color: 'bg-blue-500'
    },
    {
      icon: Lightbulb,
      title: t('about.innovation'),
      description: t('about.innovationText'),
      color: 'bg-yellow-500'
    },
    {
      icon: Shield,
      title: t('about.reliability'),
      description: t('about.reliabilityText'),
      color: 'bg-green-500'
    },
    {
      icon: Handshake,
      title: t('about.partnership'),
      description: t('about.partnershipText'),
      color: 'bg-purple-500'
    }
  ]

  const team = [
    {
      name: 'David Chen',
      position: 'Chief Executive Officer',
      background: 'M.S. in Robotics Engineering from Technion, MBA from Tel Aviv University',
      experience: '15+ years in robotics and automation',
      image: teamDiverse,
      expertise: ['Strategic Planning', 'Technology Integration', 'International Business']
    },
    {
      name: 'Dr. Sarah Goldstein',
      position: 'Chief Technology Officer',
      background: 'Ph.D. in Computer Science from Hebrew University',
      experience: 'Extensive research in autonomous systems',
      image: teamMeeting,
      expertise: ['Autonomous Navigation', 'Sensor Integration', 'Software Development']
    },
    {
      name: 'Michael Rosenberg',
      position: 'VP of Operations',
      background: 'B.S. in Industrial Engineering from Ben-Gurion University',
      experience: 'Operations management in Israeli industry',
      image: modernOffice,
      expertise: ['Operations Management', 'Supply Chain', 'Customer Support']
    },
    {
      name: 'Rachel Aviv',
      position: 'VP of Sales & Marketing',
      background: 'MBA from IDC Herzliya',
      experience: 'B2B technology sales expertise',
      image: officeInterior,
      expertise: ['B2B Sales', 'Market Development', 'Customer Relations']
    }
  ]

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'CHIRAL established with vision to bring advanced quadruped robotics to Israeli industry'
    },
    {
      year: '2020',
      title: 'Strategic Partnerships',
      description: 'Established partnerships with leading global robotics manufacturers'
    },
    {
      year: '2021',
      title: 'First Deployments',
      description: 'Completed pilot deployments in power utility and manufacturing sectors'
    },
    {
      year: '2022',
      title: 'Market Expansion',
      description: 'Expanded operations across multiple industrial sectors'
    },
    {
      year: '2023',
      title: 'ISO Certification',
      description: 'Achieved ISO 9001 certification for quality management'
    },
    {
      year: '2024',
      title: 'Market Leadership',
      description: 'Established as Israel\'s leading provider of industrial quadruped robotics'
    }
  ]

  const certifications = [
    { name: 'ISO 9001:2015', description: 'Quality Management Systems' },
    { name: 'ISO 14001', description: 'Environmental Management' },
    { name: 'Industrial Safety', description: 'Compliance with safety standards' },
    { name: 'Power Utility', description: 'Specialized certifications for power applications' }
  ]

  const stats = [
    { number: '50+', label: 'Deployed Systems', description: 'Robotic systems successfully deployed' },
    { number: '25+', label: 'Industrial Facilities', description: 'Major facilities served across Israel' },
    { number: '200+', label: 'Trained Personnel', description: 'Professionals trained on our systems' },
    { number: '99.9%', label: 'Uptime Reliability', description: 'System availability and performance' }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className={`space-y-6 ${isRTL ? 'lg:order-2' : ''}`}>
            <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CHIRAL was founded with a vision to bring the world's most advanced quadruped robotic technologies to Israeli industry. Recognizing the unique challenges and opportunities within Israel's industrial landscape, our founders assembled a team of robotics experts, industry specialists, and local market professionals.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through strategic partnerships with leading global robotics manufacturers and deep collaboration with Israeli industrial leaders, CHIRAL has established itself as the premier provider of quadruped robotic solutions in Israel. Our success is built on a foundation of technical excellence, comprehensive support services, and unwavering commitment to customer success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/contact">
                  {t('common.contactUs')}
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">{t('common.learnMore')}</Link>
              </Button>
            </div>
          </div>
          <div className={`relative ${isRTL ? 'lg:order-1' : ''}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={teamDiverse}
                alt="CHIRAL Team"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-muted/50 rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('about.missionTitle')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To establish Israel as a global leader in the adoption and application of advanced quadruped robotics across critical industrial sectors, while setting new standards for innovation, reliability, and customer success in the robotics industry.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('about.valuesTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values guide every decision and drive our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`mx-auto mb-4 p-4 rounded-lg w-fit ${value.color}`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('about.teamTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.teamDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary">
                    {member.position}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{member.background}</p>
                  <p className="text-sm text-muted-foreground mb-3">{member.experience}</p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Journey
          </h2>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <Badge variant="outline">{milestone.year}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-sm opacity-90">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Certifications & Compliance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Partner with CHIRAL?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the growing number of Israeli enterprises that trust CHIRAL for their robotic automation needs. Let's discuss how we can transform your operations together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                {t('nav.requestDemo')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/applications">View Applications</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

