import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, Trash2, FileText, Eye, Loader2 } from 'lucide-react'

const BrochureManager = () => {
  const [brochures, setBrochures] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    file: null
  })

  const categories = [
    { value: 'x30', label: 'X30 Series' },
    { value: 'x20', label: 'X20 Series' },
    { value: 'lite3', label: 'Lite3 Series' },
    { value: 'general', label: 'General Company' },
    { value: 'applications', label: 'Applications' }
  ]

  // Load existing brochures
  useEffect(() => {
    loadBrochures()
  }, [])

  const loadBrochures = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brochures')
      if (response.ok) {
        const data = await response.json()
        setBrochures(data)
      }
    } catch (error) {
      console.error('Failed to load brochures:', error)
      setError('Failed to load brochures')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, JPG, or PNG file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setUploadForm(prev => ({ ...prev, file }))
      setError('')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!uploadForm.title || !uploadForm.category || !uploadForm.file) {
      setError('Please fill in all required fields and select a file')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('category', uploadForm.category)
      formData.append('brochure', uploadForm.file)

      const response = await fetch('/api/brochures', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      setSuccess('Brochure uploaded successfully!')
      setUploadForm({
        title: '',
        description: '',
        category: '',
        file: null
      })
      
      // Clear file input
      const fileInput = document.getElementById('brochure-file')
      if (fileInput) fileInput.value = ''
      
      // Reload brochures
      loadBrochures()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message || 'Failed to upload brochure')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (brochureId) => {
    if (!window.confirm('Are you sure you want to delete this brochure?')) {
      return
    }

    try {
      const response = await fetch(`/api/brochures/${brochureId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete brochure')
      }

      setSuccess('Brochure deleted successfully!')
      loadBrochures()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete brochure')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Brochure Management</h2>
        <p className="text-muted-foreground">Upload and manage product brochures and company documents.</p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload New Brochure
          </CardTitle>
          <CardDescription>
            Upload PDF brochures or images. Maximum file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-500 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({...prev, title: e.target.value}))}
                  placeholder="e.g., X30 Series Product Brochure"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={uploadForm.category} 
                  onValueChange={(value) => setUploadForm(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Brief description of the brochure content"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brochure-file">File *</Label>
              <Input
                id="brochure-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, JPG, PNG. Maximum size: 10MB.
              </p>
            </div>

            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Brochure
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Brochures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Existing Brochures ({brochures.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading brochures...
            </div>
          ) : brochures.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No brochures uploaded yet. Upload your first brochure above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brochures.map((brochure) => (
                <div key={brochure.id} className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">{brochure.title}</h4>
                    <p className="text-xs text-muted-foreground">{brochure.category}</p>
                    {brochure.description && (
                      <p className="text-xs text-muted-foreground mt-1">{brochure.description}</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Size: {formatFileSize(brochure.size)}</div>
                    <div>Uploaded: {new Date(brochure.uploadedAt).toLocaleDateString()}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => window.open(brochure.downloadUrl, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = brochure.downloadUrl
                        link.download = brochure.originalName
                        link.click()
                      }}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(brochure.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BrochureManager