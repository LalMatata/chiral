import React from 'react'
import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const currentPage = window.location.pathname
    const pageMessages = {
      '/': 'Hi! I\'m interested in CHIRAL\'s robotic solutions. Can you help me?',
      '/products': 'Hi! I\'d like to learn more about your robot products and pricing.',
      '/products/x30': 'Hi! I\'m interested in the X30 Series robot. Can we schedule a demo?',
      '/products/x20': 'Hi! I\'m interested in the X20 Series robot. Can we discuss specifications?',
      '/products/lite3': 'Hi! I\'m interested in the Lite3 Series robot. Can you provide more details?',
      '/applications': 'Hi! I\'d like to discuss how your robots can help my industry.',
      '/about': 'Hi! I\'d like to learn more about CHIRAL and your robotics solutions.',
      '/contact': 'Hi! I\'d like to get in touch about your robotic solutions.'
    }
    
    const message = pageMessages[currentPage] || 'Hi! I\'m interested in CHIRAL\'s robotic solutions.'
    const encodedMessage = encodeURIComponent(message)
    const israeliPhoneNumber = '972123456789' // Replace with actual Israeli WhatsApp Business number
    const whatsappUrl = `https://wa.me/${israeliPhoneNumber}?text=${encodedMessage}`
    
    // Track WhatsApp click
    if (window.trackWhatsApp) {
      window.trackWhatsApp(currentPage)
    }
    if (window.fbTrackContact) {
      window.fbTrackContact()
    }
    
    // Open WhatsApp in new window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        title="Chat with us on WhatsApp"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat on WhatsApp
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
      </button>
    </div>
  )
}

export default WhatsAppButton