import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users, Mail, TrendingUp, Clock, AlertCircle, CheckCircle,
  Download, Filter, Search, Plus, Settings, LogOut, Bell
} from 'lucide-react';
import { toast } from 'sonner';
import io from 'socket.io-client';

import LeadDashboard from './LeadDashboard';
import BrochureManager from './BrochureManager';
import LeadsList from './LeadsList';
import LeadDetails from './LeadDetails';
import FollowUpList from './FollowUpList';
import DashboardMetrics from './DashboardMetrics';
import EmailTemplates from './EmailTemplates';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [stats, setStats] = useState({});
  const [recentLeads, setRecentLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      // For now, continue without authentication to maintain existing functionality
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Try to authenticate, but don't fail if auth service isn't available
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        initializeSocket(token);
        loadDashboardData();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    })
    .catch(err => {
      console.log('Auth service not available, continuing without auth');
      setIsAuthenticated(false);
      setLoading(false);
    });
  }, [navigate]);

  const initializeSocket = (token) => {
    try {
      const newSocket = io();
      
      newSocket.on('connect', () => {
        newSocket.emit('authenticate', token);
      });

      newSocket.on('dashboard_data', (data) => {
        setStats(data.stats || {});
        setRecentLeads(data.recent_leads || []);
        setLoading(false);
      });

      newSocket.on('new_lead', (data) => {
        toast.success(`New lead: ${data.lead?.company_name}`, {
          description: data.message,
          action: {
            label: 'View',
            onClick: () => {
              setSelectedLead(data.lead);
              setActiveTab('leads');
            }
          }
        });
        
        loadDashboardData();
      });

      newSocket.on('auth_error', (error) => {
        console.log('Socket auth error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.log('Socket connection not available');
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch('/api/leads/dashboard/metrics', {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.leads || {});
        setRecentLeads(data.recent_leads || []);
      }
    } catch (error) {
      console.log('Dashboard data not available');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    if (socket) socket.disconnect();
    setIsAuthenticated(false);
    setUser(null);
  };

  const exportData = async (format) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`/api/leads/export/${format}`, {
        headers
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Data exported as ${format.toUpperCase()}`);
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  CHIRAL Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('csv')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('xlsx')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>

              {isAuthenticated && (
                <>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <Badge variant="secondary">{notifications.length}</Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="leads">
              Leads
              {stats.new_leads > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {stats.new_leads}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="brochures">Brochures</TabsTrigger>
            <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {isAuthenticated && user?.role === 'admin' && (
              <TabsTrigger value="users">Users</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {isAuthenticated ? (
              <>
                <DashboardMetrics stats={stats} />
                
                {/* Recent Leads */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>
                      Latest leads received from the website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentLeads.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No recent leads found
                        </p>
                      ) : (
                        recentLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSelectedLead(lead);
                              setActiveTab('leads');
                            }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {lead.company_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {lead.contact_person} • {lead.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={
                                  lead.inquiry_type === 'demo' ? 'default' :
                                  lead.inquiry_type === 'sales' ? 'secondary' : 'outline'
                                }
                              >
                                {lead.inquiry_type}
                              </Badge>
                              <Badge variant="outline">
                                Score: {lead.score}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <LeadDashboard />
            )}
          </TabsContent>

          <TabsContent value="leads">
            {isAuthenticated ? (
              <LeadsList
                selectedLead={selectedLead}
                onSelectLead={setSelectedLead}
              />
            ) : (
              <LeadDashboard />
            )}
          </TabsContent>

          <TabsContent value="brochures">
            <BrochureManager />
          </TabsContent>

          <TabsContent value="follow-ups">
            {isAuthenticated ? (
              <FollowUpList />
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Authentication required to access follow-ups
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            {isAuthenticated ? (
              <DashboardMetrics stats={stats} detailed={true} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>Website performance and conversion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Analytics Available</h3>
                    <p className="text-muted-foreground">
                      Authentication required for detailed analytics and reporting features.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isAuthenticated && user?.role === 'admin' && (
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>

        {/* Lead Details Modal */}
        {selectedLead && (
          <LeadDetails
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={loadDashboardData}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;