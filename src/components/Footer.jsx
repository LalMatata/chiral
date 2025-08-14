import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Send, Loader2, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    // Client-side validation
    if (!email) {
      setError('Please enter your email address.')
      setLoading(false)
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to subscribe')
      }
      
      setSuccess(true)
      
      // Track successful newsletter signup
      if (window.trackNewsletter) {
        window.trackNewsletter();
      }
      
      setEmail('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setError(error.message || 'Failed to subscribe. Please try again.')
      console.error('Newsletter subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="text-xl font-bold text-primary">CHIRAL</div>
              <div className="ml-2 text-sm text-muted-foreground">
                Robotics
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              CHIRAL has established itself as a leading global provider of advanced quadruped robotics solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/applications" className="text-sm text-muted-foreground hover:text-primary">
                  Applications
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/x30" className="text-sm text-muted-foreground hover:text-primary">
                  X30 Series
                </Link>
              </li>
              <li>
                <Link to="/products/x20" className="text-sm text-muted-foreground hover:text-primary">
                  X20 Series
                </Link>
              </li>
              <li>
                <Link to="/products/lite3" className="text-sm text-muted-foreground hover:text-primary">
                  Lite3 Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on robotics technology and industry insights.
            </p>
            
            {success && (
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 icon-success" />
                <span className="icon-success">Successfully subscribed!</span>
              </div>
            )}
            
            {error && (
              <p className="text-sm icon-error">{error}</p>
            )}
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="text-sm"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="w-full"
                disabled={loading || !email}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 icon-secondary" />
                <span>+1-XXX-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 icon-secondary" />
                <span>info@chiralrobotics.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 CHIRAL Robotics Solutions Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer