import db, { prepare } from '../db.js';

class FollowUp {
  static create(data) {
    const stmt = prepare(`
      INSERT INTO follow_ups (
        lead_id, action, notes, performed_by, scheduled_for
      ) VALUES (
        @lead_id, @action, @notes, @performed_by, @scheduled_for
      )
    `);
    
    const info = stmt.run({
      lead_id: data.leadId,
      action: data.action,
      notes: data.notes || null,
      performed_by: data.performedBy || null,
      scheduled_for: data.scheduledFor || null
    });
    
    return this.findById(info.lastInsertRowid);
  }

  static findById(id) {
    const stmt = prepare('SELECT * FROM follow_ups WHERE id = ?');
    return stmt.get(id);
  }

  static findByLeadId(leadId) {
    const stmt = prepare(`
      SELECT * FROM follow_ups 
      WHERE lead_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(leadId);
  }

  static findPending() {
    const stmt = prepare(`
      SELECT f.*, l.company_name, l.contact_person, l.email 
      FROM follow_ups f
      JOIN leads l ON f.lead_id = l.id
      WHERE f.completed_at IS NULL 
        AND f.scheduled_for <= datetime('now')
      ORDER BY f.scheduled_for ASC
    `);
    return stmt.all();
  }

  static findUpcoming(days = 7) {
    const stmt = prepare(`
      SELECT f.*, l.company_name, l.contact_person, l.email 
      FROM follow_ups f
      JOIN leads l ON f.lead_id = l.id
      WHERE f.completed_at IS NULL 
        AND f.scheduled_for BETWEEN datetime('now') AND datetime('now', '+${days} days')
      ORDER BY f.scheduled_for ASC
    `);
    return stmt.all();
  }

  static complete(id, notes = null) {
    const stmt = prepare(`
      UPDATE follow_ups 
      SET completed_at = CURRENT_TIMESTAMP,
          notes = CASE WHEN @notes IS NOT NULL THEN @notes ELSE notes END
      WHERE id = @id
    `);
    
    stmt.run({ id, notes });
    return this.findById(id);
  }

  static update(id, data) {
    const fields = [];
    const params = { id };

    const allowedFields = ['action', 'notes', 'scheduled_for', 'performed_by'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = @${field}`);
        params[field] = data[field];
      }
    }

    if (fields.length === 0) return this.findById(id);

    const stmt = prepare(`UPDATE follow_ups SET ${fields.join(', ')} WHERE id = @id`);
    stmt.run(params);

    return this.findById(id);
  }

  static delete(id) {
    const stmt = prepare('DELETE FROM follow_ups WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  static getStatistics() {
    const stats = prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed_at IS NULL AND scheduled_for <= datetime('now') THEN 1 ELSE 0 END) as overdue,
        SUM(CASE WHEN completed_at IS NULL AND scheduled_for > datetime('now') THEN 1 ELSE 0 END) as pending
      FROM follow_ups
    `).get();

    const byAction = prepare(`
      SELECT action, COUNT(*) as count
      FROM follow_ups
      GROUP BY action
      ORDER BY count DESC
    `).all();

    return {
      ...stats,
      by_action: byAction
    };
  }
}

export default FollowUp;