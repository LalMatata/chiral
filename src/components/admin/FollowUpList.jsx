import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, CheckCircle, AlertTriangle, Calendar, User, Building,
  Phone, Mail, MessageSquare, MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [pendingFollowUps, setPendingFollowUps] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadFollowUps();
  }, []);

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Load pending follow-ups
      const pendingResponse = await fetch('/api/follow-ups/pending', {
        headers
      });

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingFollowUps(pendingData);
      }

      // Load upcoming follow-ups
      const upcomingResponse = await fetch('/api/follow-ups/upcoming', {
        headers
      });

      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        setUpcomingFollowUps(upcomingData);
      }

      // Load all follow-ups for history
      const allResponse = await fetch('/api/follow-ups', {
        headers
      });

      if (allResponse.ok) {
        const allData = await allResponse.json();
        setFollowUps(allData);
      }

    } catch (error) {
      console.error('Error loading follow-ups:', error);
      toast.error('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteFollowUp = async (followUpId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await fetch(`/api/leads/follow-ups/${followUpId}/complete`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          notes: 'Completed from dashboard'
        })
      });

      if (response.ok) {
        toast.success('Follow-up marked as completed');
        loadFollowUps();
      } else {
        toast.error('Failed to complete follow-up');
      }
    } catch (error) {
      console.error('Error completing follow-up:', error);
      toast.error('Failed to complete follow-up');
    }
  };

  const getFollowUpPriority = (followUp) => {
    if (!followUp.scheduled_for) return 'medium';
    
    const scheduledTime = new Date(followUp.scheduled_for);
    const now = new Date();
    const diffHours = (scheduledTime - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'high'; // Overdue
    if (diffHours < 24) return 'high'; // Due today
    if (diffHours < 72) return 'medium'; // Due within 3 days
    return 'low';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    
    return (
      <Badge className={colors[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (followUp) => {
    if (followUp.completed_at) {
      return <Badge className="bg-green-500 text-white">Completed</Badge>;
    }
    
    if (followUp.scheduled_for) {
      const scheduledTime = new Date(followUp.scheduled_for);
      const now = new Date();
      
      if (scheduledTime < now) {
        return <Badge className="bg-red-500 text-white">Overdue</Badge>;
      }
      
      const diffHours = (scheduledTime - now) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return <Badge className="bg-orange-500 text-white">Due Today</Badge>;
      }
    }
    
    return <Badge variant="outline">Pending</Badge>;
  };

  const FollowUpCard = ({ followUp, showActions = true }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-medium text-gray-900">{followUp.action}</h3>
              {getPriorityBadge(getFollowUpPriority(followUp))}
              {getStatusBadge(followUp)}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{followUp.company_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{followUp.contact_person}</span>
              </div>
              {followUp.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{followUp.email}</span>
                </div>
              )}
            </div>

            {followUp.notes && (
              <p className="text-sm text-gray-600 mb-2">{followUp.notes}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                {followUp.scheduled_for && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(followUp.scheduled_for).toLocaleDateString()} at{' '}
                      {new Date(followUp.scheduled_for).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Created {new Date(followUp.created_at).toLocaleDateString()}</span>
                </div>
                {followUp.performed_by && (
                  <span>by {followUp.performed_by}</span>
                )}
              </div>
            </div>
          </div>

          {showActions && !followUp.completed_at && (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCompleteFollowUp(followUp.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Contact
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const overdueCount = pendingFollowUps.filter(f => 
    f.scheduled_for && new Date(f.scheduled_for) < new Date()
  ).length;

  const todayCount = pendingFollowUps.filter(f => {
    if (!f.scheduled_for) return false;
    const scheduledDate = new Date(f.scheduled_for).toDateString();
    const today = new Date().toDateString();
    return scheduledDate === today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{todayCount}</p>
                <p className="text-sm text-gray-600">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{upcomingFollowUps.length}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {followUps.filter(f => f.completed_at).length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts for overdue items */}
      {overdueCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            You have {overdueCount} overdue follow-up{overdueCount !== 1 ? 's' : ''} that need immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Follow-ups Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({followUps.filter(f => f.completed_at).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Pending Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingFollowUps.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No pending follow-ups
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingFollowUps
                    .sort((a, b) => {
                      // Sort by priority (overdue first, then by scheduled time)
                      const aPriority = getFollowUpPriority(a);
                      const bPriority = getFollowUpPriority(b);
                      
                      if (aPriority !== bPriority) {
                        const priorityOrder = { high: 0, medium: 1, low: 2 };
                        return priorityOrder[aPriority] - priorityOrder[bPriority];
                      }
                      
                      // If same priority, sort by scheduled time
                      if (a.scheduled_for && b.scheduled_for) {
                        return new Date(a.scheduled_for) - new Date(b.scheduled_for);
                      }
                      
                      return new Date(a.created_at) - new Date(b.created_at);
                    })
                    .map((followUp) => (
                      <FollowUpCard 
                        key={followUp.id} 
                        followUp={followUp} 
                        showActions={true}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingFollowUps.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No upcoming follow-ups scheduled
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingFollowUps
                    .sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for))
                    .map((followUp) => (
                      <FollowUpCard 
                        key={followUp.id} 
                        followUp={followUp} 
                        showActions={true}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Completed Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followUps.filter(f => f.completed_at).length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No completed follow-ups yet
                </p>
              ) : (
                <div className="space-y-4">
                  {followUps
                    .filter(f => f.completed_at)
                    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
                    .slice(0, 20) // Show last 20 completed
                    .map((followUp) => (
                      <FollowUpCard 
                        key={followUp.id} 
                        followUp={followUp} 
                        showActions={false}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowUpList;