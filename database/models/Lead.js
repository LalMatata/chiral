import db, { prepare } from '../db.js';

class Lead {
  static create(data) {
    const stmt = prepare(`
      INSERT INTO leads (
        company_name, contact_person, email, phone, inquiry_type,
        message, source, utm_source, utm_medium, utm_campaign,
        industry, budget, timeline, requirements, score
      ) VALUES (
        @company_name, @contact_person, @email, @phone, @inquiry_type,
        @message, @source, @utm_source, @utm_medium, @utm_campaign,
        @industry, @budget, @timeline, @requirements, @score
      )
    `);
    
    const info = stmt.run({
      company_name: data.companyName,
      contact_person: data.contactPerson,
      email: data.email,
      phone: data.phone || null,
      inquiry_type: data.inquiryType || data.formType,
      message: data.message || null,
      source: data.source || 'direct',
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
      industry: data.industry || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      requirements: data.requirements || data.technicalRequirements || null,
      score: this.calculateScore(data)
    });
    
    return this.findById(info.lastInsertRowid);
  }

  static findAll(filters = {}) {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = {};

    if (filters.status) {
      query += ' AND status = @status';
      params.status = filters.status;
    }

    if (filters.inquiry_type) {
      query += ' AND inquiry_type = @inquiry_type';
      params.inquiry_type = filters.inquiry_type;
    }

    if (filters.assigned_to) {
      query += ' AND assigned_to = @assigned_to';
      params.assigned_to = filters.assigned_to;
    }

    if (filters.from_date) {
      query += ' AND created_at >= @from_date';
      params.from_date = filters.from_date;
    }

    if (filters.to_date) {
      query += ' AND created_at <= @to_date';
      params.to_date = filters.to_date;
    }

    if (filters.search) {
      query += ' AND (company_name LIKE @search OR contact_person LIKE @search OR email LIKE @search)';
      params.search = `%${filters.search}%`;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT @limit';
      params.limit = filters.limit;
    }

    if (filters.offset) {
      query += ' OFFSET @offset';
      params.offset = filters.offset;
    }

    const stmt = prepare(query);
    return stmt.all(params);
  }

  static findById(id) {
    const stmt = prepare('SELECT * FROM leads WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email) {
    const stmt = prepare('SELECT * FROM leads WHERE email = ? ORDER BY created_at DESC');
    return stmt.all(email);
  }

  static update(id, data) {
    const fields = [];
    const params = { id };

    const allowedFields = [
      'status', 'score', 'assigned_to', 'tags', 'company_name',
      'contact_person', 'phone', 'industry', 'budget', 'timeline',
      'requirements', 'message'
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = @${field}`);
        params[field] = data[field];
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const stmt = prepare(`UPDATE leads SET ${fields.join(', ')} WHERE id = @id`);
    stmt.run(params);

    return this.findById(id);
  }

  static updateStatus(id, status, assignedTo = null) {
    const stmt = prepare(`
      UPDATE leads 
      SET status = @status, 
          assigned_to = @assigned_to,
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = @id
    `);
    
    stmt.run({ id, status, assigned_to: assignedTo });
    return this.findById(id);
  }

  static delete(id) {
    const stmt = prepare('DELETE FROM leads WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  static calculateScore(data) {
    let score = 0;

    if (data.inquiryType === 'demo' || data.formType === 'demo') score += 30;
    else if (data.inquiryType === 'sales' || data.formType === 'sales') score += 20;
    else score += 10;

    if (data.budget) {
      if (data.budget.includes('100k') || data.budget.includes('250k')) score += 20;
      else if (data.budget.includes('50k')) score += 15;
      else if (data.budget.includes('25k')) score += 10;
    }

    if (data.timeline) {
      if (data.timeline.includes('immediate') || data.timeline.includes('month')) score += 15;
      else if (data.timeline.includes('quarter')) score += 10;
      else if (data.timeline.includes('year')) score += 5;
    }

    if (data.phone) score += 5;

    if (data.industry) {
      const highValueIndustries = ['defense', 'security', 'industrial', 'logistics'];
      if (highValueIndustries.some(ind => data.industry.toLowerCase().includes(ind))) {
        score += 10;
      }
    }

    if (data.companyName) {
      const companySize = data.companyName.toLowerCase();
      if (companySize.includes('ltd') || companySize.includes('inc') || companySize.includes('corp')) {
        score += 5;
      }
    }

    return Math.min(score, 100);
  }

  static getStatistics(period = 'all') {
    let dateFilter = '';
    
    if (period === 'today') {
      dateFilter = "AND DATE(created_at) = DATE('now')";
    } else if (period === 'week') {
      dateFilter = "AND created_at >= datetime('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "AND created_at >= datetime('now', '-30 days')";
    }

    const stats = prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) as qualified,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
        SUM(CASE WHEN inquiry_type = 'demo' THEN 1 ELSE 0 END) as demo_requests,
        SUM(CASE WHEN inquiry_type = 'sales' THEN 1 ELSE 0 END) as sales_inquiries,
        AVG(score) as avg_score
      FROM leads
      WHERE 1=1 ${dateFilter}
    `).get();

    const bySource = prepare(`
      SELECT source, COUNT(*) as count
      FROM leads
      WHERE 1=1 ${dateFilter}
      GROUP BY source
      ORDER BY count DESC
    `).all();

    const byIndustry = prepare(`
      SELECT industry, COUNT(*) as count
      FROM leads
      WHERE industry IS NOT NULL ${dateFilter}
      GROUP BY industry
      ORDER BY count DESC
      LIMIT 10
    `).all();

    return {
      ...stats,
      conversion_rate: stats.total > 0 ? (stats.converted / stats.total * 100).toFixed(2) : 0,
      by_source: bySource,
      by_industry: byIndustry
    };
  }
}

export default Lead;