import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const DebugData = () => {
  const { t } = useLanguage()
  
  const stats = t('home.stats')
  const products = t('home.products.items')
  const applications = t('home.applications.items')
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', background: '#f0f0f0' }}>
      <h1>Debug Data Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Stats Data:</h2>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
        <p>Type: {typeof stats}, Is Array: {Array.isArray(stats) ? 'yes' : 'no'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Products Data:</h2>
        <pre>{JSON.stringify(products, null, 2)}</pre>
        <p>Type: {typeof products}, Is Array: {Array.isArray(products) ? 'yes' : 'no'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Applications Data:</h2>
        <pre>{JSON.stringify(applications, null, 2)}</pre>
        <p>Type: {typeof applications}, Is Array: {Array.isArray(applications) ? 'yes' : 'no'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Full Home Data:</h2>
        <pre>{JSON.stringify(t('home'), null, 2)}</pre>
      </div>
    </div>
  )
}

export default DebugData