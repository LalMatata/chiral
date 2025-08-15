import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'

// Context
import { LanguageProvider } from './contexts/LanguageContext'

// Loading Components
import { PageLoadingOverlay } from './components/ui/LoadingComponents'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './components/pages/Home'
import Products from './components/pages/Products'
import SimpleProducts from './components/pages/SimpleProducts'
import ProductDetail from './components/pages/ProductDetail'
import DebugRouter from './components/pages/DebugRouter'
import Applications from './components/pages/Applications'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import TestPage from './components/pages/TestPage'
import SimpleNavTest from './components/pages/SimpleNavTest'
import DebugData from './components/pages/DebugData'
import AdminDashboard from './components/admin/AdminDashboard'

function AnimatedRoutes() {
  const location = useLocation()
  const [isPageLoading, setIsPageLoading] = useState(false)
  
  useEffect(() => {
    // Show loading overlay on route change
    setIsPageLoading(true)
    const timer = setTimeout(() => setIsPageLoading(false), 300) // Short delay for smooth UX
    
    return () => clearTimeout(timer)
  }, [location.pathname])
  
  return (
    <>
      {isPageLoading && (
        <PageLoadingOverlay 
          message="Loading page..." 
          showSpinner={true}
        />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<SimpleProducts />} />
          <Route path="/products-simple" element={<SimpleProducts />} />
          <Route path="/products/:model" element={<ProductDetail />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/debug" element={<DebugRouter />} />
          <Route path="/simple-nav-test" element={<SimpleNavTest />} />
          <Route path="/debug-data" element={<DebugData />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main id="main-content" role="main">
            <AnimatedRoutes />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

