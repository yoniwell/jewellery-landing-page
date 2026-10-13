import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { mapInquiryRow, logActivity } from '../utils/helpers.js';
import { AuthRequest } from '../middleware/auth.js';

export const getInquiries = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM buyer_inquiries ORDER BY created_at DESC');
    const inquiries = result.rows.map(mapInquiryRow);

    return res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error: any) {
    console.error('getInquiries error:', error);
    return res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
};

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.email || !data.gemstoneWanted) {
      return res.status(400).json({ error: 'Name, email, and gemstone wanted are required' });
    }

    const inqId = data.id || `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    const insertSql = `
      INSERT INTO buyer_inquiries (
        id, name, company, country, email, whatsapp, gemstone_wanted,
        stone_id, stone_name, rough_or_finished, approximate_carat,
        budget_range, message, timestamp, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      inqId,
      data.name,
      data.company || '',
      data.country || 'International',
      data.email,
      data.whatsapp || '',
      data.gemstoneWanted,
      data.stoneId || null,
      data.stoneName || null,
      data.roughOrFinished || 'Finished Gemstone',
      data.approximateCarat || '',
      data.budgetRange || 'Unspecified',
      data.message || '',
      timestamp,
      data.status || 'New',
    ];

    const result = await pool.query(insertSql, values);
    const newInquiry = mapInquiryRow(result.rows[0]);

    await logActivity(
      `New buyer inquiry from ${newInquiry.name} (${newInquiry.country}) for ${newInquiry.gemstoneWanted}`,
      'Public Portal'
    );

    return res.status(201).json({
      success: true,
      data: newInquiry,
    });
  } catch (error: any) {
    console.error('submitInquiry error:', error);
    return res.status(500).json({ error: 'Failed to submit inquiry to database' });
  }
};

export const updateInquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingRes = await pool.query('SELECT * FROM buyer_inquiries WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const updateSql = `
      UPDATE buyer_inquiries SET
        status = COALESCE($1, status),
        message = COALESCE($2, message),
        company = COALESCE($3, company),
        country = COALESCE($4, country),
        whatsapp = COALESCE($5, whatsapp),
        budget_range = COALESCE($6, budget_range)
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      data.status,
      data.message,
      data.company,
      data.country,
      data.whatsapp,
      data.budgetRange,
      id,
    ];

    const result = await pool.query(updateSql, values);
    const updated = mapInquiryRow(result.rows[0]);

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('updateInquiry error:', error);
    return res.status(500).json({ error: 'Failed to update inquiry' });
  }
};

export const deleteInquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM buyer_inquiries WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    return res.json({
      success: true,
      message: 'Inquiry deleted successfully',
      data: mapInquiryRow(result.rows[0]),
    });
  } catch (error: any) {
    console.error('deleteInquiry error:', error);
    return res.status(500).json({ error: 'Failed to delete inquiry' });
  }
};
