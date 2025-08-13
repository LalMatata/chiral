import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/pages/Home'
import Products from './components/pages/Products'
import ProductDetail from './components/pages/ProductDetail'
import Applications from './components/pages/Applications'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import Demo from './components/pages/Demo'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Analytics />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/demo" element={<Demo />} />
              
              {/* Hebrew routes */}
              <Route path="/he" element={<Home />} />
              <Route path="/he/products" element={<Products />} />
              <Route path="/he/products/:productId" element={<ProductDetail />} />
              <Route path="/he/applications" element={<Applications />} />
              <Route path="/he/about" element={<About />} />
              <Route path="/he/contact" element={<Contact />} />
              <Route path="/he/demo" element={<Demo />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

