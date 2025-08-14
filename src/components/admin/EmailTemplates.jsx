import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, Edit, Trash2, Plus, Eye, Send, Copy 
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Thank you for contacting CHIRAL Robotics',
      category: 'auto-reply',
      html_content: `
        <h2>Thank you for contacting CHIRAL Robotics</h2>
        <p>Dear {{contactPerson}},</p>
        <p>We have received your {{inquiryType}} and appreciate your interest in CHIRAL's advanced robotics solutions.</p>
        <p>Our team will review your requirements and contact you within 24 hours.</p>
        <p>Best regards,<br>The CHIRAL Team</p>
      `,
      variables: ['contactPerson', 'inquiryType', 'companyName'],
      is_active: true
    },
    {
      id: 'lead_notification',
      name: 'Lead Notification',
      subject: '🚨 New Lead: {{companyName}}',
      category: 'notification',
      html_content: `
        <h2>New Lead Alert</h2>
        <div style="background-color: #f8f9fa; padding: 20px;">
          <h3>Lead Information</h3>
          <ul>
            <li><strong>Company:</strong> {{companyName}}</li>
            <li><strong>Contact:</strong> {{contactPerson}}</li>
            <li><strong>Email:</strong> {{email}}</li>
            <li><strong>Type:</strong> {{inquiryType}}</li>
            <li><strong>Score:</strong> {{score}}/100</li>
          </ul>
        </div>
        <p><strong>Action Required:</strong> Contact within 2 hours for maximum conversion</p>
      `,
      variables: ['companyName', 'contactPerson', 'email', 'inquiryType', 'score'],
      is_active: true
    },
    {
      id: 'demo_confirmation',
      name: 'Demo Confirmation',
      subject: 'Demo Session Confirmed - {{companyName}}',
      category: 'follow-up',
      html_content: `
        <h2>Demo Session Confirmed</h2>
        <p>Dear {{contactPerson}},</p>
        <p>Your demo session has been confirmed!</p>
        <div style="background-color: #e7f3ff; padding: 20px;">
          <h3>Demo Details:</h3>
          <ul>
            <li><strong>Date & Time:</strong> {{demoDateTime}}</li>
            <li><strong>Duration:</strong> {{duration}}</li>
            <li><strong>Location:</strong> {{location}}</li>
          </ul>
        </div>
        <p>Looking forward to demonstrating the future of robotics!</p>
        <p>Best regards,<br>The CHIRAL Demo Team</p>
      `,
      variables: ['contactPerson', 'companyName', 'demoDateTime', 'duration', 'location'],
      is_active: true
    }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    // For now, use default templates
    // In production, this would fetch from API
    setTemplates(defaultTemplates);
    setLoading(false);
  };

  const handleSaveTemplate = (template) => {
    if (editingTemplate?.id) {
      // Update existing template
      setTemplates(prev => 
        prev.map(t => t.id === editingTemplate.id ? { ...t, ...template } : t)
      );
      toast.success('Template updated successfully');
    } else {
      // Create new template
      const newTemplate = {
        ...template,
        id: `template_${Date.now()}`,
        is_active: true
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully');
    }
    
    setEditingTemplate(null);
    setIsDialogOpen(false);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully');
  };

  const previewTemplate = (template) => {
    // Simple variable replacement for preview
    let preview = template.html_content;
    template.variables?.forEach(variable => {
      const value = `[${variable}]`;
      preview = preview.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });
    return preview;
  };

  const TemplateForm = ({ template, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      subject: template?.subject || '',
      category: template?.category || 'auto-reply',
      html_content: template?.html_content || '',
      variables: template?.variables?.join(', ') || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...formData,
        variables: formData.variables.split(',').map(v => v.trim()).filter(v => v)
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto-reply">Auto-Reply</SelectItem>
              <SelectItem value="notification">Notification</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="variables">Variables (comma-separated)</Label>
          <Input
            id="variables"
            value={formData.variables}
            onChange={(e) => setFormData(prev => ({ ...prev, variables: e.target.value }))}
            placeholder="contactPerson, companyName, inquiryType"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use {{variableName}} in your template content
          </p>
        </div>

        <div>
          <Label htmlFor="content">HTML Content</Label>
          <Textarea
            id="content"
            value={formData.html_content}
            onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
            rows={10}
            required
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">Save Template</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-gray-600">Manage email templates for automated communications</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTemplate(null)}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
              <DialogDescription>
                Create and customize email templates for your automated communications
              </DialogDescription>
            </DialogHeader>
            
            <TemplateForm
              template={editingTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setEditingTemplate(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={template.is_active ? 'default' : 'secondary'}
                  >
                    {template.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Subject</Label>
                  <p className="text-sm">{template.subject}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Variables</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables?.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Template Preview</DialogTitle>
                          <DialogDescription>{template.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Subject Line</Label>
                            <div className="p-2 bg-gray-50 rounded text-sm">
                              {template.subject}
                            </div>
                          </div>
                          <div>
                            <Label>Content</Label>
                            <div 
                              className="p-4 bg-gray-50 rounded text-sm"
                              dangerouslySetInnerHTML={{ __html: previewTemplate(template) }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingTemplate(template);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(template.html_content);
                        toast.success('Template copied to clipboard');
                      }}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
              <p className="text-gray-600 mb-4">
                Create your first email template to get started with automated communications.
              </p>
              <Button onClick={() => {
                setEditingTemplate(null);
                setIsDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailTemplates;