import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Filter, Users, Mail, Phone, Calendar, 
  ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2,
  CheckSquare, Square
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LeadsList = ({ selectedLead, onSelectLead }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    loadLeads();
  }, [search, statusFilter, inquiryTypeFilter, sortField, sortDirection, currentPage]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (inquiryTypeFilter) params.append('inquiry_type', inquiryTypeFilter);

      const response = await fetch(`/api/leads?${params.toString()}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setTotalPages(data.pagination?.total_pages || 1);
      } else {
        toast.error('Failed to load leads');
      }
    } catch (error) {
      console.error('Error loading leads:', error);
      toast.error('Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedLeads.length === 0) {
      toast.error('Please select leads first');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await fetch('/api/leads/bulk/update-status', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          leadIds: selectedLeads,
          status: newStatus
        })
      });

      if (response.ok) {
        toast.success(`Updated ${selectedLeads.length} leads to ${newStatus}`);
        setSelectedLeads([]);
        loadLeads();
      } else {
        toast.error('Bulk update failed');
      }
    } catch (error) {
      console.error('Error updating leads:', error);
      toast.error('Bulk update failed');
    }
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Badge 
        className={`${statusOption?.color || 'bg-gray-500'} text-white`}
      >
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getScoreBadge = (score) => {
    const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <Badge className={`${color} text-white`}>
        {score}
      </Badge>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lead Management</span>
          {selectedLeads.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {selectedLeads.length} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statusOptions.map(status => (
                    <DropdownMenuItem 
                      key={status.value}
                      onClick={() => handleBulkStatusUpdate(status.value)}
                    >
                      {status.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={inquiryTypeFilter} onValueChange={setInquiryTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="demo">Demo</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leads Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('company_name')}
                    className="p-0 font-semibold"
                  >
                    Company <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('inquiry_type')}
                    className="p-0 font-semibold"
                  >
                    Type <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('score')}
                    className="p-0 font-semibold"
                  >
                    Score <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('created_at')}
                    className="p-0 font-semibold"
                  >
                    Date <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell 
                      className="font-medium"
                      onClick={() => onSelectLead(lead)}
                    >
                      <div>
                        <p className="font-medium">{lead.company_name}</p>
                        {lead.industry && (
                          <p className="text-sm text-gray-500">{lead.industry}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => onSelectLead(lead)}>
                      <div>
                        <p className="text-sm font-medium">{lead.contact_person}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => onSelectLead(lead)}>
                      <Badge variant="outline">
                        {lead.inquiry_type}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => onSelectLead(lead)}>
                      {getStatusBadge(lead.status)}
                    </TableCell>
                    <TableCell onClick={() => onSelectLead(lead)}>
                      {getScoreBadge(lead.score)}
                    </TableCell>
                    <TableCell onClick={() => onSelectLead(lead)}>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onSelectLead(lead)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsList;