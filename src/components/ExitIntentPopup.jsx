import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let hasShown = sessionStorage.getItem('exitIntentShown')
    if (hasShown) return

    const handleMouseLeave = (e) => {
      // Only trigger if mouse leaves through the top of the page
      if (e.clientY <= 0) {
        setIsVisible(true)
        sessionStorage.setItem('exitIntentShown', 'true')
      }
    }

    // Add delay to avoid triggering immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 10000) // Show after 10 seconds minimum

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSuccess(true)
        
        // Track conversion
        if (window.trackNewsletter) {
          window.trackNewsletter()
        }
        if (window.fbTrackLead) {
          window.fbTrackLead(500)
        }
        
        setTimeout(() => {
          setIsVisible(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-in slide-in-from-top-4">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">Thank you for subscribing. We'll send you updates on robotics solutions and industry insights.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Wait! Don't miss out.</h3>
              <p className="text-gray-600">Get exclusive insights on industrial robotics and be the first to know about our latest solutions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Subscribing...' : 'Get Free Robotics Updates'}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              No spam, unsubscribe at any time. Privacy policy compliant.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ExitIntentPopup