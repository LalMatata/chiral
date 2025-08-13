import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { t, language, toggleLanguage, isRTL } = useLanguage()

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.applications'), href: '/applications' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CHIRAL</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & CTA Button */}
          <div className={`hidden md:flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              title={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'עברית' : 'English'}</span>
            </button>
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {t('nav.requestDemo')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLanguage()
                  setIsMenuOpen(false)
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                <Globe size={16} />
                <span>{language === 'en' ? 'עברית' : 'English'}</span>
              </button>
              <Link
                to="/contact"
                className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.requestDemo')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

