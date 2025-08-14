import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Building, User, Mail, Phone, Calendar, MapPin, 
  Star, Clock, MessageSquare, FileText, Send, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const LeadDetails = ({ lead, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [followUps, setFollowUps] = useState([]);
  const [newFollowUp, setNewFollowUp] = useState({
    action: '',
    notes: '',
    scheduledFor: ''
  });
  const [statusUpdate, setStatusUpdate] = useState({
    status: lead?.status || 'new',
    assignedTo: lead?.assigned_to || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-blue-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
    { value: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
    { value: 'proposal', label: 'Proposal', color: 'bg-orange-500' },
    { value: 'negotiation', label: 'Negotiation', color: 'bg-indigo-500' },
    { value: 'won', label: 'Won', color: 'bg-green-500' },
    { value: 'lost', label: 'Lost', color: 'bg-red-500' },
    { value: 'nurturing', label: 'Nurturing', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    if (lead?.id) {
      loadFollowUps();
    }
  }, [lead?.id]);

  const loadFollowUps = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`/api/leads/${lead.id}/follow-ups`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setFollowUps(data);
      }
    } catch (error) {
      console.error('Error loading follow-ups:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await fetch(`/api/leads/${lead.id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(statusUpdate)
      });

      if (response.ok) {
        toast.success('Lead status updated successfully');
        onUpdate();
        loadFollowUps(); // Reload to see the new follow-up entry
      } else {
        toast.error('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update lead status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFollowUp = async () => {
    if (!newFollowUp.action.trim()) {
      toast.error('Please enter an action');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await fetch(`/api/leads/${lead.id}/follow-up`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newFollowUp)
      });

      if (response.ok) {
        toast.success('Follow-up added successfully');
        setNewFollowUp({ action: '', notes: '', scheduledFor: '' });
        loadFollowUps();
      } else {
        toast.error('Failed to add follow-up');
      }
    } catch (error) {
      console.error('Error adding follow-up:', error);
      toast.error('Failed to add follow-up');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Badge className={`${statusOption?.color || 'bg-gray-500'} text-white`}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getScoreBadge = (score) => {
    const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <Badge className={`${color} text-white`}>
        {score}/100
      </Badge>
    );
  };

  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{lead.company_name}</span>
            <div className="flex items-center space-x-2">
              {getStatusBadge(lead.status)}
              {getScoreBadge(lead.score)}
            </div>
          </DialogTitle>
          <DialogDescription>
            Lead ID: {lead.id} • Created {new Date(lead.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="follow-ups">Follow-ups ({followUps.length})</TabsTrigger>
            <TabsTrigger value="status">Update Status</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{lead.company_name}</p>
                      {lead.industry && (
                        <p className="text-sm text-gray-500">{lead.industry}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <p>{lead.contact_person}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lead Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Lead Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Inquiry Type</Label>
                    <Badge variant="outline" className="ml-2">
                      {lead.inquiry_type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Source</Label>
                    <p className="text-sm">{lead.source || 'Direct'}</p>
                  </div>
                  {lead.utm_source && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">UTM Source</Label>
                      <p className="text-sm">{lead.utm_source}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Lead Score</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getScoreBadge(lead.score)}
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(lead.score / 20) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {lead.assigned_to && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                      <p className="text-sm">{lead.assigned_to}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Details */}
            {(lead.budget || lead.timeline || lead.requirements || lead.message) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lead.budget && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Budget</Label>
                      <p className="text-sm">{lead.budget}</p>
                    </div>
                  )}
                  {lead.timeline && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Timeline</Label>
                      <p className="text-sm">{lead.timeline}</p>
                    </div>
                  )}
                  {lead.requirements && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Requirements</Label>
                      <p className="text-sm whitespace-pre-wrap">{lead.requirements}</p>
                    </div>
                  )}
                  {lead.message && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Message</Label>
                      <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="follow-ups" className="space-y-4">
            {/* Add New Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Follow-up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="action">Action *</Label>
                  <Input
                    id="action"
                    placeholder="e.g., Call to discuss requirements"
                    value={newFollowUp.action}
                    onChange={(e) => setNewFollowUp(prev => ({
                      ...prev,
                      action: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or context"
                    value={newFollowUp.notes}
                    onChange={(e) => setNewFollowUp(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledFor">Scheduled For</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={newFollowUp.scheduledFor}
                    onChange={(e) => setNewFollowUp(prev => ({
                      ...prev,
                      scheduledFor: e.target.value
                    }))}
                  />
                </div>
                <Button 
                  onClick={handleAddFollowUp}
                  disabled={loading || !newFollowUp.action.trim()}
                >
                  Add Follow-up
                </Button>
              </CardContent>
            </Card>

            {/* Follow-up History */}
            <Card>
              <CardHeader>
                <CardTitle>Follow-up History</CardTitle>
              </CardHeader>
              <CardContent>
                {followUps.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No follow-ups recorded yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {followUps.map((followUp) => (
                      <div 
                        key={followUp.id} 
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{followUp.action}</h4>
                          <div className="flex items-center space-x-2">
                            {followUp.completed_at ? (
                              <Badge className="bg-green-500 text-white">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                Pending
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(followUp.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {followUp.notes && (
                          <p className="text-sm text-gray-600 mb-2">
                            {followUp.notes}
                          </p>
                        )}
                        {followUp.scheduled_for && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            Scheduled for {new Date(followUp.scheduled_for).toLocaleString()}
                          </div>
                        )}
                        {followUp.performed_by && (
                          <div className="text-xs text-gray-500 mt-1">
                            By {followUp.performed_by}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Lead Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={statusUpdate.status} 
                    onValueChange={(value) => setStatusUpdate(prev => ({
                      ...prev,
                      status: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    placeholder="Enter assignee name"
                    value={statusUpdate.assignedTo}
                    onChange={(e) => setStatusUpdate(prev => ({
                      ...prev,
                      assignedTo: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="statusNotes">Notes</Label>
                  <Textarea
                    id="statusNotes"
                    placeholder="Add notes about the status change"
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                  />
                </div>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={loading}
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Send Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Communication tracking coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetails;