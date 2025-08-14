import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, Eye, Loader2 } from 'lucide-react'

const BrochureDisplay = ({ category, showTitle = true, maxItems = null }) => {
  const [brochures, setBrochures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBrochures()
  }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadBrochures = async () => {
    try {
      setLoading(true)
      const endpoint = category 
        ? `/api/brochures/category/${category}` 
        : '/api/brochures'
      
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        const displayBrochures = maxItems ? data.slice(0, maxItems) : data
        setBrochures(displayBrochures)
      } else {
        throw new Error('Failed to load brochures')
      }
    } catch (error) {
      console.error('Failed to load brochures:', error)
      setError('Failed to load brochures')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (brochure) => {
    // Track brochure download
    if (window.gtag) {
      window.gtag('event', 'brochure_download', {
        event_category: 'Content',
        event_label: brochure.title,
        file_name: brochure.originalName,
        product_category: brochure.category
      })
    }

    // Trigger download
    const link = document.createElement('a')
    link.href = brochure.downloadUrl
    link.download = brochure.originalName
    link.click()
  }

  const handleView = (brochure) => {
    // Track brochure view
    if (window.gtag) {
      window.gtag('event', 'brochure_view', {
        event_category: 'Content',
        event_label: brochure.title,
        file_name: brochure.originalName,
        product_category: brochure.category
      })
    }

    // Open in new tab
    window.open(brochure.downloadUrl, '_blank')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimetype) => {
    if (mimetype === 'application/pdf') {
      return <FileText className="h-8 w-8 icon-error" />
    } else if (mimetype.startsWith('image/')) {
      return <Eye className="h-8 w-8 icon-primary" />
    }
    return <FileText className="h-8 w-8 icon-secondary" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading brochures...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {error}
      </div>
    )
  }

  if (brochures.length === 0) {
    return null // Don't show anything if no brochures
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="text-xl font-semibold text-foreground">
          Download Resources
        </h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brochures.map((brochure) => (
          <Card key={brochure.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getFileIcon(brochure.mimetype)}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-medium leading-tight">
                    {brochure.title}
                  </CardTitle>
                  {brochure.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {brochure.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(brochure.size)}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleView(brochure)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(brochure)}
                  className="flex-1"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BrochureDisplay