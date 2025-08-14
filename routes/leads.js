import express from 'express';
import Lead from '../database/models/Lead.js';
import FollowUp from '../database/models/FollowUp.js';
import EmailQueue from '../services/EmailQueue.js';
import Auth from '../middleware/auth.js';
import { createWriteStream } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', Auth.middleware, (req, res) => {
  try {
    const {
      status,
      inquiry_type,
      assigned_to,
      from_date,
      to_date,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (inquiry_type) filters.inquiry_type = inquiry_type;
    if (assigned_to) filters.assigned_to = assigned_to;
    if (from_date) filters.from_date = from_date;
    if (to_date) filters.to_date = to_date;
    if (search) filters.search = search;

    const offset = (page - 1) * limit;
    filters.limit = parseInt(limit);
    filters.offset = offset;

    const leads = Lead.findAll(filters);
    const totalWithoutPaging = Lead.findAll({ ...filters, limit: undefined, offset: undefined });

    res.json({
      leads,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: totalWithoutPaging.length,
        total_pages: Math.ceil(totalWithoutPaging.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.get('/statistics', Auth.middleware, (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const stats = Lead.getStatistics(period);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.get('/:id', Auth.middleware, (req, res) => {
  try {
    const lead = Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const followUps = FollowUp.findByLeadId(req.params.id);
    
    res.json({
      lead,
      follow_ups: followUps
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

router.put('/:id', Auth.middleware, (req, res) => {
  try {
    const lead = Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const updatedLead = Lead.update(req.params.id, req.body);
    
    if (req.body.status && req.body.status !== lead.status) {
      FollowUp.create({
        leadId: req.params.id,
        action: `Status changed from ${lead.status} to ${req.body.status}`,
        notes: req.body.notes || `Updated by ${req.user.username}`,
        performedBy: req.user.username
      });
    }

    res.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

router.put('/:id/status', Auth.middleware, (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurturing'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses 
      });
    }

    const lead = Lead.updateStatus(req.params.id, status, assignedTo);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    FollowUp.create({
      leadId: req.params.id,
      action: `Status updated to ${status}`,
      notes: notes || `Updated by ${req.user.username}`,
      performedBy: req.user.username
    });

    if (status === 'won') {
      EmailQueue.create({
        leadId: req.params.id,
        recipient: process.env.SALES_EMAIL || 'sales@chiral-robotics.com',
        subject: `🎉 Lead Converted: ${lead.company_name}`,
        template: 'lead_won_notification',
        data: { ...lead, convertedBy: req.user.username }
      });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

router.delete('/:id', Auth.middleware, Auth.requireRole(['admin']), (req, res) => {
  try {
    const success = Lead.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

router.post('/:id/follow-up', Auth.middleware, (req, res) => {
  try {
    const { action, notes, scheduledFor } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const followUp = FollowUp.create({
      leadId: req.params.id,
      action,
      notes,
      performedBy: req.user.username,
      scheduledFor
    });

    res.json(followUp);
  } catch (error) {
    console.error('Error creating follow-up:', error);
    res.status(500).json({ error: 'Failed to create follow-up' });
  }
});

router.get('/:id/follow-ups', Auth.middleware, (req, res) => {
  try {
    const followUps = FollowUp.findByLeadId(req.params.id);
    res.json(followUps);
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    res.status(500).json({ error: 'Failed to fetch follow-ups' });
  }
});

router.put('/follow-ups/:followUpId/complete', Auth.middleware, (req, res) => {
  try {
    const { notes } = req.body;
    const followUp = FollowUp.complete(req.params.followUpId, notes);
    
    if (!followUp) {
      return res.status(404).json({ error: 'Follow-up not found' });
    }

    res.json(followUp);
  } catch (error) {
    console.error('Error completing follow-up:', error);
    res.status(500).json({ error: 'Failed to complete follow-up' });
  }
});

router.get('/export/csv', Auth.middleware, async (req, res) => {
  try {
    const { status, from_date, to_date } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (from_date) filters.from_date = from_date;
    if (to_date) filters.to_date = to_date;

    const leads = Lead.findAll(filters);
    
    const exportData = leads.map(lead => ({
      ID: lead.id,
      'Company Name': lead.company_name,
      'Contact Person': lead.contact_person,
      'Email': lead.email,
      'Phone': lead.phone || '',
      'Inquiry Type': lead.inquiry_type,
      'Industry': lead.industry || '',
      'Status': lead.status,
      'Score': lead.score,
      'Source': lead.source,
      'Budget': lead.budget || '',
      'Timeline': lead.timeline || '',
      'Assigned To': lead.assigned_to || '',
      'Created Date': new Date(lead.created_at).toLocaleDateString(),
      'Updated Date': new Date(lead.updated_at).toLocaleDateString()
    }));

    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, '../exports/leads_export.csv'),
      header: Object.keys(exportData[0] || {}).map(key => ({ id: key, title: key }))
    });

    await csvWriter.writeRecords(exportData);

    res.download(path.join(__dirname, '../exports/leads_export.csv'), 'leads_export.csv');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

router.get('/export/xlsx', Auth.middleware, (req, res) => {
  try {
    const { status, from_date, to_date } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (from_date) filters.from_date = from_date;
    if (to_date) filters.to_date = to_date;

    const leads = Lead.findAll(filters);
    
    const exportData = leads.map(lead => ({
      'ID': lead.id,
      'Company Name': lead.company_name,
      'Contact Person': lead.contact_person,
      'Email': lead.email,
      'Phone': lead.phone || '',
      'Inquiry Type': lead.inquiry_type,
      'Industry': lead.industry || '',
      'Status': lead.status,
      'Score': lead.score,
      'Source': lead.source,
      'Budget': lead.budget || '',
      'Timeline': lead.timeline || '',
      'Assigned To': lead.assigned_to || '',
      'Created Date': new Date(lead.created_at).toLocaleDateString(),
      'Updated Date': new Date(lead.updated_at).toLocaleDateString(),
      'Message': lead.message || '',
      'Requirements': lead.requirements || ''
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads');

    worksheet['!cols'] = [
      { width: 5 },
      { width: 30 },
      { width: 25 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 12 },
      { width: 10 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 40 },
      { width: 40 }
    ];

    const exportDir = path.join(__dirname, '../exports');
    if (!require('fs').existsSync(exportDir)) {
      require('fs').mkdirSync(exportDir, { recursive: true });
    }

    const filename = `leads_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filepath = path.join(exportDir, filename);
    
    xlsx.writeFile(workbook, filepath);

    res.download(filepath, filename);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ error: 'Failed to export Excel' });
  }
});

router.get('/dashboard/metrics', Auth.middleware, (req, res) => {
  try {
    const stats = Lead.getStatistics();
    const followUpStats = FollowUp.getStatistics();
    const pendingFollowUps = FollowUp.findPending();
    const upcomingFollowUps = FollowUp.findUpcoming();

    res.json({
      leads: stats,
      follow_ups: followUpStats,
      pending_follow_ups: pendingFollowUps.length,
      upcoming_follow_ups: upcomingFollowUps.length,
      recent_leads: Lead.findAll({ limit: 5 }),
      high_score_leads: Lead.findAll().filter(lead => lead.score >= 70).slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

router.post('/bulk/assign', Auth.middleware, (req, res) => {
  try {
    const { leadIds, assignedTo } = req.body;
    
    if (!leadIds || !Array.isArray(leadIds) || !assignedTo) {
      return res.status(400).json({ error: 'Lead IDs array and assignedTo are required' });
    }

    const results = leadIds.map(id => {
      try {
        return Lead.update(id, { assigned_to: assignedTo });
      } catch (error) {
        return { id, error: error.message };
      }
    });

    res.json({
      success: true,
      results,
      assigned_count: results.filter(r => !r.error).length
    });
  } catch (error) {
    console.error('Error bulk assigning leads:', error);
    res.status(500).json({ error: 'Failed to bulk assign leads' });
  }
});

router.post('/bulk/update-status', Auth.middleware, (req, res) => {
  try {
    const { leadIds, status } = req.body;
    
    if (!leadIds || !Array.isArray(leadIds) || !status) {
      return res.status(400).json({ error: 'Lead IDs array and status are required' });
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurturing'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const results = leadIds.map(id => {
      try {
        return Lead.updateStatus(id, status);
      } catch (error) {
        return { id, error: error.message };
      }
    });

    leadIds.forEach(id => {
      FollowUp.create({
        leadId: id,
        action: `Bulk status update to ${status}`,
        performedBy: req.user.username
      });
    });

    res.json({
      success: true,
      results,
      updated_count: results.filter(r => !r.error).length
    });
  } catch (error) {
    console.error('Error bulk updating lead status:', error);
    res.status(500).json({ error: 'Failed to bulk update lead status' });
  }
});

export default router;