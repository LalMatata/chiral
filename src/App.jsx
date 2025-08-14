import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ExitIntentPopup from './components/ExitIntentPopup'
import Home from './components/pages/Home'
import Products from './components/pages/Products'
import ProductDetail from './components/pages/ProductDetail'
import Applications from './components/pages/Applications'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import LeadDashboard from './components/admin/LeadDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:model" element={<ProductDetail />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/dashboard" element={<LeadDashboard />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <ExitIntentPopup />
      </div>
    </Router>
  )
}

export default App

