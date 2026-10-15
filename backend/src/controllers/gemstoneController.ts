import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { mapGemstoneRow, logActivity } from '../utils/helpers.js';
import { AuthRequest } from '../middleware/auth.js';

export const getGemstones = async (req: Request, res: Response) => {
  try {
    const { category, status, isRough } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (category && category !== 'all' && category !== 'ALL') {
      conditions.push(`category = $${paramIndex++}`);
      values.push(category);
    }

    if (status && status !== 'all' && status !== 'ALL') {
      conditions.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (isRough !== undefined) {
      conditions.push(`is_rough = $${paramIndex++}`);
      values.push(isRough === 'true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM gemstones ${whereClause} ORDER BY featured DESC, created_at DESC`;

    const result = await pool.query(sql, values);
    const gemstones = result.rows.map(mapGemstoneRow);

    return res.json({
      success: true,
      count: gemstones.length,
      data: gemstones,
    });
  } catch (error: any) {
    console.error('getGemstones error:', error);
    return res.status(500).json({ error: 'Failed to retrieve gemstones from database' });
  }
};

export const getGemstoneById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM gemstones WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gemstone not found' });
    }

    return res.json({
      success: true,
      data: mapGemstoneRow(result.rows[0]),
    });
  } catch (error: any) {
    console.error('getGemstoneById error:', error);
    return res.status(500).json({ error: 'Failed to retrieve gemstone' });
  }
};

export const createGemstone = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.category) {
      return res.status(400).json({ error: 'Stone name and category are required' });
    }

    const prefix = data.category === 'paraiba' ? 'AG-PB' :
                   data.category === 'sapphire' ? 'AG-SP' :
                   data.category === 'rough' ? 'AG-RG' :
                   data.category === 'emerald' ? 'AG-EM' : 'AG-RS';

    const stoneId = data.id || `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const weightCarats = data.weightCarats ? Number(data.weightCarats) : 0;
    const priceUsd = data.priceUsd !== undefined && data.priceUsd !== null && data.priceUsd !== ''
      ? Number(data.priceUsd) 
      : null;

    const images = Array.isArray(data.images) ? data.images : [];

    const insertSql = `
      INSERT INTO gemstones (
        id, name, category, sub_category, weight_carats, dimensions,
        shape_cut, color, origin, treatment, clarity, price_usd,
        price_formatted, status, is_rough, cutting_potential, description,
        images, video_url, has_360_view, featured, certificate, date_added
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *
    `;

    const values = [
      stoneId,
      data.name,
      data.category,
      data.subCategory || '',
      weightCarats,
      data.dimensions || 'N/A',
      data.shapeCut || 'Faceted',
      data.color || 'Vivid',
      data.origin || 'Ethiopia',
      data.treatment || 'Natural / Unheated',
      data.clarity || 'Eye Clean',
      priceUsd,
      data.priceFormatted || (priceUsd ? `$${priceUsd.toLocaleString()} USD` : 'Price on Request'),
      data.status || 'AVAILABLE',
      Boolean(data.isRough),
      data.cuttingPotential || null,
      data.description || '',
      JSON.stringify(images),
      data.videoUrl || null,
      Boolean(data.has360View),
      Boolean(data.featured),
      data.certificate ? JSON.stringify(data.certificate) : null,
      data.dateAdded || new Date().toISOString().slice(0, 10),
    ];

    const result = await pool.query(insertSql, values);
    const newStone = mapGemstoneRow(result.rows[0]);

    await logActivity(`Added new gemstone: ${newStone.name} (${newStone.id})`, req.user?.name || 'Admin');

    return res.status(201).json({
      success: true,
      data: newStone,
    });
  } catch (error: any) {
    console.error('createGemstone error:', error);
    return res.status(500).json({ error: 'Failed to create gemstone in database' });
  }
};

export const updateGemstone = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingRes = await pool.query('SELECT * FROM gemstones WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Gemstone not found' });
    }

    const current = existingRes.rows[0];

    const updatedWeight = data.weightCarats !== undefined ? Number(data.weightCarats) : current.weight_carats;
    const updatedPriceUsd = data.priceUsd !== undefined 
      ? (data.priceUsd !== null && data.priceUsd !== '' ? Number(data.priceUsd) : null)
      : current.price_usd;
    const updatedImages = data.images !== undefined 
      ? JSON.stringify(data.images) 
      : JSON.stringify(current.images);
    const updatedCertificate = data.certificate !== undefined 
      ? (data.certificate ? JSON.stringify(data.certificate) : null) 
      : (current.certificate ? JSON.stringify(current.certificate) : null);

    const updateSql = `
      UPDATE gemstones SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        sub_category = COALESCE($3, sub_category),
        weight_carats = $4,
        dimensions = COALESCE($5, dimensions),
        shape_cut = COALESCE($6, shape_cut),
        color = COALESCE($7, color),
        origin = COALESCE($8, origin),
        treatment = COALESCE($9, treatment),
        clarity = COALESCE($10, clarity),
        price_usd = $11,
        price_formatted = COALESCE($12, price_formatted),
        status = COALESCE($13, status),
        is_rough = COALESCE($14, is_rough),
        cutting_potential = $15,
        description = COALESCE($16, description),
        images = $17::jsonb,
        video_url = $18,
        has_360_view = COALESCE($19, has_360_view),
        featured = COALESCE($20, featured),
        certificate = $21::jsonb,
        updated_at = NOW()
      WHERE id = $22
      RETURNING *
    `;

    const values = [
      data.name,
      data.category,
      data.subCategory,
      updatedWeight,
      data.dimensions,
      data.shapeCut,
      data.color,
      data.origin,
      data.treatment,
      data.clarity,
      updatedPriceUsd,
      data.priceFormatted,
      data.status,
      data.isRough !== undefined ? Boolean(data.isRough) : null,
      data.cuttingPotential !== undefined ? data.cuttingPotential : current.cutting_potential,
      data.description,
      updatedImages,
      data.videoUrl !== undefined ? data.videoUrl : current.video_url,
      data.has360View !== undefined ? Boolean(data.has360View) : null,
      data.featured !== undefined ? Boolean(data.featured) : null,
      updatedCertificate,
      id,
    ];

    const result = await pool.query(updateSql, values);
    const updated = mapGemstoneRow(result.rows[0]);

    await logActivity(`Updated stone: ${updated.name} (Status: ${updated.status})`, req.user?.name || 'Admin');

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('updateGemstone error:', error);
    return res.status(500).json({ error: 'Failed to update gemstone in database' });
  }
};

export const deleteGemstone = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM gemstones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gemstone not found' });
    }

    const removed = mapGemstoneRow(result.rows[0]);
    await logActivity(`Deleted stone from catalog: ${removed.name} (${removed.id})`, req.user?.name || 'Admin');

    return res.json({
      success: true,
      message: 'Gemstone removed successfully',
      data: removed,
    });
  } catch (error: any) {
    console.error('deleteGemstone error:', error);
    return res.status(500).json({ error: 'Failed to delete gemstone' });
  }
};

export const clearAllGemstones = async (req: AuthRequest, res: Response) => {
  try {
    const countRes = await pool.query('SELECT COUNT(*) as count FROM gemstones');
    const count = Number(countRes.rows[0]?.count || 0);

    await pool.query('DELETE FROM gemstones');
    await logActivity(`Cleared all ${count} stones from inventory`, req.user?.name || 'Admin');

    return res.json({
      success: true,
      message: `All ${count} stones deleted. Ready for real data input.`,
      count,
    });
  } catch (error: any) {
    console.error('clearAllGemstones error:', error);
    return res.status(500).json({ error: 'Failed to clear gemstones' });
  }
};

export const resetRealGemstones = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM gemstones');
    await logActivity('Reset gemstone table to clean state (0 specimens)', req.user?.name || 'Admin');

    return res.json({
      success: true,
      message: 'Reset gemstone table to clean state',
      data: [],
    });
  } catch (error: any) {
    console.error('resetRealGemstones error:', error);
    return res.status(500).json({ error: 'Failed to reset gemstones' });
  }
};
