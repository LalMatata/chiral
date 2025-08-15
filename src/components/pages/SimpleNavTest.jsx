import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const SimpleNavTest = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Simple Navigation Test</h1>
      <p>Current path: <strong>{location.pathname}</strong></p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Test React Router Links:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ padding: '10px', background: '#blue', color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/products" style={{ padding: '10px', background: '#green', color: 'white', textDecoration: 'none' }}>Products</Link>
          <Link to="/about" style={{ padding: '10px', background: '#purple', color: 'white', textDecoration: 'none' }}>About</Link>
          <Link to="/contact" style={{ padding: '10px', background: '#orange', color: 'white', textDecoration: 'none' }}>Contact</Link>
          <Link to="/applications" style={{ padding: '10px', background: '#red', color: 'white', textDecoration: 'none' }}>Applications</Link>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Test useNavigate:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/')} style={{ padding: '10px' }}>Navigate to Home</button>
          <button onClick={() => navigate('/products')} style={{ padding: '10px' }}>Navigate to Products</button>
          <button onClick={() => navigate('/about')} style={{ padding: '10px' }}>Navigate to About</button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Test Regular Links (for comparison):</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/" style={{ padding: '10px', background: '#gray', color: 'white', textDecoration: 'none' }}>Home (regular)</a>
          <a href="/products" style={{ padding: '10px', background: '#gray', color: 'white', textDecoration: 'none' }}>Products (regular)</a>
        </div>
      </div>
    </div>
  )
}

export default SimpleNavTest