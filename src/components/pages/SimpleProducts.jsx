import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import AnimatedPage from '../AnimatedPage'

const SimpleProducts = () => {
  const { t } = useLanguage()
  const homeData = t('home')
  const productItems = homeData?.products?.items || []

  return (
    <AnimatedPage>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            {homeData?.products?.title || 'Products'}
          </h1>
          
          <p className="text-xl text-gray-600 text-center mb-12">
            {homeData?.products?.subtitle || 'Our robotic solutions'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productItems.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-subtitle icon-primary mb-4">{item.subtitle}</p>
                <p className="text-gray-600 mb-6">{item.description}</p>
                
                {item.features && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {item.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-sm text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-primary text-white rounded-lg">
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {productItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products data found in LanguageContext</p>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  )
}

export default SimpleProducts