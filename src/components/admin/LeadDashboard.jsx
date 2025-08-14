import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  MessageCircle, 
  Mail, 
  Calendar,
  Phone,
  ExternalLink 
} from 'lucide-react'

const LeadDashboard = () => {
  const [leads, setLeads] = useState([])
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    todayLeads: 0,
    conversionRate: 0,
    totalValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
    fetchMetrics()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLeadScore = (lead) => {
    let score = 0
    if (lead.companyName) score += 20
    if (lead.phone) score += 15
    if (lead.message && lead.message.length > 50) score += 10
    if (lead.productInterest) score += 25
    if (lead.formType === 'demo') score += 30
    return Math.min(score, 100)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your leads in real-time</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                +{metrics.todayLeads} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lead Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Total pipeline value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Lead Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.length > 0 ? Math.round(leads.reduce((acc, lead) => acc + getLeadScore(lead), 0) / leads.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 100
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Latest lead submissions with scoring and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leads found</p>
                <p className="text-sm text-gray-400">New leads will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Score</th>
                      <th className="text-left p-2">Company</th>
                      <th className="text-left p-2">Contact</th>
                      <th className="text-left p-2">Product Interest</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => {
                      const score = getLeadScore(lead)
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <Badge className={`${getScoreColor(score)} text-white`}>
                              {score}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{lead.companyName}</div>
                              <div className="text-sm text-gray-500">{lead.contactPerson}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            {lead.productInterest ? (
                              <Badge variant="outline">{lead.productInterest}</Badge>
                            ) : (
                              <span className="text-gray-400">General</span>
                            )}
                          </td>
                          <td className="p-2">
                            <Badge 
                              variant={lead.formType === 'demo' ? 'default' : 'secondary'}
                            >
                              {lead.formType || 'contact'}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-gray-500">
                            {formatDate(lead.timestamp)}
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" asChild>
                                <a href={`mailto:${lead.email}`} target="_blank" rel="noopener noreferrer">
                                  <Mail className="h-3 w-3" />
                                </a>
                              </Button>
                              {lead.phone && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={`tel:${lead.phone}`}>
                                    <Phone className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                              <Button size="sm" variant="outline" asChild>
                                <a 
                                  href={`https://wa.me/972123456789?text=Hi ${lead.contactPerson}, regarding your inquiry about ${lead.productInterest || 'our robotics solutions'}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LeadDashboard