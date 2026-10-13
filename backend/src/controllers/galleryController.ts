import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { mapGalleryRow, logActivity } from '../utils/helpers.js';
import { AuthRequest } from '../middleware/auth.js';

export const getGallery = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_items ORDER BY created_at DESC');
    const items = result.rows.map(mapGalleryRow);

    return res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: any) {
    console.error('getGallery error:', error);
    return res.status(500).json({ error: 'Failed to retrieve gallery items' });
  }
};

export const addGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.imageUrl) {
      return res.status(400).json({ error: 'Title and image URL are required' });
    }

    const id = data.id || `gal-${Date.now()}`;
    const insertSql = `
      INSERT INTO gallery_items (id, title, category, image_url, thumbnail_url, description, origin, is_video)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      id,
      data.title,
      data.category || 'Paraíba',
      data.imageUrl,
      data.thumbnailUrl || data.imageUrl,
      data.description || '',
      data.origin || '',
      Boolean(data.isVideo),
    ];

    const result = await pool.query(insertSql, values);
    const newItem = mapGalleryRow(result.rows[0]);

    await logActivity(`Added media to Luxury Gallery: "${newItem.title}" (${newItem.category})`, req.user?.name || 'Admin');

    return res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error: any) {
    console.error('addGalleryItem error:', error);
    return res.status(500).json({ error: 'Failed to add gallery item' });
  }
};

export const updateGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingRes = await pool.query('SELECT * FROM gallery_items WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const updateSql = `
      UPDATE gallery_items SET
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        image_url = COALESCE($3, image_url),
        thumbnail_url = COALESCE($4, thumbnail_url),
        description = COALESCE($5, description),
        origin = COALESCE($6, origin),
        is_video = COALESCE($7, is_video)
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      data.title,
      data.category,
      data.imageUrl,
      data.thumbnailUrl,
      data.description,
      data.origin,
      data.isVideo !== undefined ? Boolean(data.isVideo) : null,
      id,
    ];

    const result = await pool.query(updateSql, values);
    const updated = mapGalleryRow(result.rows[0]);

    await logActivity(`Updated Gallery media: "${updated.title}"`, req.user?.name || 'Admin');

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('updateGalleryItem error:', error);
    return res.status(500).json({ error: 'Failed to update gallery item' });
  }
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM gallery_items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const removed = mapGalleryRow(result.rows[0]);
    await logActivity(`Removed Gallery media: "${removed.title}"`, req.user?.name || 'Admin');

    return res.json({
      success: true,
      message: 'Gallery item deleted successfully',
      data: removed,
    });
  } catch (error: any) {
    console.error('deleteGalleryItem error:', error);
    return res.status(500).json({ error: 'Failed to delete gallery item' });
  }
};
