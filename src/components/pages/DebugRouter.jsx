import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const DebugRouter = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const testNavigation = (path) => {
    console.log('Navigating to:', path)
    navigate(path)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Router Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Current Location:</h2>
        <code className="bg-gray-100 p-2 rounded">
          {location.pathname}
        </code>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Test Links (React Router Link):</h2>
        <div className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
          <Link to="/about" className="text-blue-600 hover:underline">About</Link>
          <Link to="/applications" className="text-blue-600 hover:underline">Applications</Link>
          <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Test Buttons (useNavigate):</h2>
        <div className="space-x-4">
          <button onClick={() => testNavigation('/')} className="px-4 py-2 bg-blue-500 text-white rounded">Home</button>
          <button onClick={() => testNavigation('/products')} className="px-4 py-2 bg-blue-500 text-white rounded">Products</button>
          <button onClick={() => testNavigation('/about')} className="px-4 py-2 bg-blue-500 text-white rounded">About</button>
          <button onClick={() => testNavigation('/applications')} className="px-4 py-2 bg-blue-500 text-white rounded">Applications</button>
          <button onClick={() => testNavigation('/contact')} className="px-4 py-2 bg-blue-500 text-white rounded">Contact</button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Standard HTML Links (for comparison):</h2>
        <div className="space-x-4">
          <a href="/" className="text-green-600 hover:underline">Home</a>
          <a href="/products" className="text-green-600 hover:underline">Products</a>
          <a href="/about" className="text-green-600 hover:underline">About</a>
          <a href="/applications" className="text-green-600 hover:underline">Applications</a>
          <a href="/contact" className="text-green-600 hover:underline">Contact</a>
        </div>
      </div>
    </div>
  )
}

export default DebugRouter