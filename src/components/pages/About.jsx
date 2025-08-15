import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Award, Users, Target, Lightbulb, Shield, Handshake, Calendar, MapPin, Mail, Phone } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import AnimatedPage from '../AnimatedPage'

// Import images
import teamDiverse from '../../assets/images/company/team-diverse.jpg'
import modernOffice from '../../assets/images/company/modern-office.jpg'

const About = () => {
  const { t } = useLanguage()

  const aboutData = t('about')
  const values = aboutData.values || []
  const teamMembers = aboutData.team?.members || []
  const milestones = aboutData.journey?.milestones || []
  const impactStats = aboutData.impact?.stats || []
  const certifications = aboutData.certifications?.items || []

  const valueIcons = [Award, Lightbulb, Shield, Handshake]

  return (
    <AnimatedPage>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              {aboutData.hero?.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {aboutData.hero?.subtitle}
            </p>
          </div>

          {/* Hero Image & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={modernOffice}
                alt="CHIRAL Office"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                {aboutData.story?.title}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                {aboutData.story?.content?.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">{aboutData.mission?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {aboutData.mission?.content}
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">{aboutData.vision?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {aboutData.vision?.content}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = valueIcons[index] || Award
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-lg w-fit">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Team Section */}
          {teamMembers.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {aboutData.team?.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {aboutData.team?.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Education</h4>
                        <p className="text-sm">{member.education}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Experience</h4>
                        <p className="text-sm">{member.experience}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise?.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={teamDiverse}
                  alt="CHIRAL Team"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}

          {/* Journey Timeline */}
          {milestones.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                {aboutData.journey?.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {milestones.map((milestone, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                      </div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Impact Stats */}
          {impactStats.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                {aboutData.impact?.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {impactStats.map((stat, index) => (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-lg font-semibold mb-1">{stat.label}</div>
                      <div className="text-sm text-muted-foreground">{stat.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                {aboutData.certifications?.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert, index) => (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="mx-auto mb-4 p-3 bg-green-100 rounded-lg w-fit">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {cert.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
                  Get Information
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">View Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default About