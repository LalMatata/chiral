import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Award, Users, Target, Lightbulb, Shield, Handshake } from 'lucide-react'

// Import images
import teamDiverse from '../../assets/images/company/team-diverse.jpg'
import modernOffice from '../../assets/images/company/modern-office.jpg'

const About = () => {

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We are committed to delivering the highest quality robotic solutions and support services.',
      color: 'bg-blue-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and innovative approaches that deliver superior value.',
      color: 'bg-yellow-500'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'We ensure that our solutions consistently meet the highest standards of reliability and performance.',
      color: 'bg-green-500'
    },
    {
      icon: Handshake,
      title: 'Partnership',
      description: 'We view our relationships with customers as true partnerships, working collaboratively.',
      color: 'bg-purple-500'
    }
  ]

  const teamStats = [
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Delivered' },
    { number: '25+', label: 'Enterprise Clients' },
    { number: '99%', label: 'Customer Satisfaction' }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            CHIRAL - Pioneering Global Robotic Excellence
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Founded with a vision to bring the world's most advanced quadruped robotic technologies to global industry.
          </p>
        </div>

        {/* Hero Image & Mission */}
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
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CHIRAL is dedicated to transforming global industry through the introduction and support of advanced quadruped robotic technologies.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We specialize in bringing world-class robotic solutions to the world's most demanding industrial environments, from power utilities to security applications. Our focus is on delivering reliable, efficient, and safe robotic systems that enhance operational capabilities while reducing risk.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`mx-auto mb-4 p-4 ${value.color} rounded-lg w-fit`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Expert Team Driving Robotic Innovation
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our professionals combine deep technical knowledge with extensive industry experience. We understand the unique challenges facing global enterprises and bring specialized expertise in robotics, automation, and industrial applications.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {teamStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={teamDiverse}
                alt="CHIRAL Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-lg w-fit">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>System Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Complete integration services from initial assessment through deployment and ongoing support.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-lg w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Training & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive training programs and 24/7 technical support to ensure optimal system performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-lg w-fit">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Rigorous quality control processes and ongoing monitoring to maintain the highest performance standards.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Partner with CHIRAL
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover how our expertise and advanced robotic solutions can transform your operations.
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
  )
}

export default About