import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Mail, TrendingUp, Clock, DollarSign, Target, 
  ArrowUpIcon, ArrowDownIcon, Activity 
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardMetrics = ({ stats = {}, detailed = false }) => {
  const metrics = [
    {
      title: 'Total Leads',
      value: stats.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'New Leads',
      value: stats.new_leads || 0,
      icon: Mail,
      color: 'bg-green-500',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Demo Requests',
      value: stats.demo_requests || 0,
      icon: Target,
      color: 'bg-purple-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversion_rate || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '-2%',
      trend: 'down'
    },
    {
      title: 'Pipeline Value',
      value: `₪${(stats.total_value || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Avg. Score',
      value: Math.round(stats.avg_score || 0),
      icon: Activity,
      color: 'bg-indigo-500',
      change: '+3%',
      trend: 'up'
    }
  ];

  const sourceData = stats.by_source || [];
  const industryData = stats.by_industry || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const sampleTrendData = [
    { date: '2024-01-01', leads: 12, value: 45000 },
    { date: '2024-01-02', leads: 8, value: 32000 },
    { date: '2024-01-03', leads: 15, value: 58000 },
    { date: '2024-01-04', leads: 10, value: 38000 },
    { date: '2024-01-05', leads: 18, value: 72000 },
    { date: '2024-01-06', leads: 14, value: 55000 },
    { date: '2024-01-07', leads: 22, value: 85000 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {detailed && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Leads Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sampleTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pipeline Value */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                    />
                    <YAxis tickFormatter={(value) => `₪${(value/1000).toFixed(0)}K`} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`₪${value.toLocaleString()}`, 'Pipeline Value']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Source and Industry Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {sourceData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={sourceData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                      {sourceData.map((source, index) => (
                        <div key={source.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{source.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{source.leads} leads</p>
                            <p className="text-xs text-gray-500">₪{source.value?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">No source data available</p>
                )}
              </CardContent>
            </Card>

            {/* Top Industries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryData.length > 0 ? (
                    industryData.map((industry, index) => (
                      <div key={industry.industry} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{industry.industry}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {industry.count} leads
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No industry data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { status: 'New', count: stats.new_leads || 0, color: 'bg-blue-500' },
                  { status: 'Contacted', count: stats.contacted || 0, color: 'bg-yellow-500' },
                  { status: 'Qualified', count: stats.qualified || 0, color: 'bg-purple-500' },
                  { status: 'Proposal', count: stats.proposal || 0, color: 'bg-orange-500' },
                  { status: 'Won', count: stats.converted || 0, color: 'bg-green-500' }
                ].map((item) => (
                  <div key={item.status} className="text-center">
                    <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-lg">{item.count}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{item.status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardMetrics;