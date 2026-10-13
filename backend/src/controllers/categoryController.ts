import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { logActivity } from '../utils/helpers.js';
import { AuthRequest } from '../middleware/auth.js';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        c.id, c.name, c.slug, c.description, c.created_at,
        COUNT(g.id)::int as "stoneCount"
      FROM categories c
      LEFT JOIN gemstones g ON g.category = c.slug
      GROUP BY c.id, c.name, c.slug, c.description, c.created_at
      ORDER BY c.created_at ASC
    `;

    const result = await pool.query(sql);
    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('getCategories error:', error);
    return res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const existing = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const catId = `cat-${Date.now()}`;
    const desc = description || `Selected ${name} specimens direct from African sources.`;

    const result = await pool.query(
      'INSERT INTO categories (id, name, slug, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [catId, name, slug, desc]
    );

    const newCat = result.rows[0];
    await logActivity(`Created new gemstone category: "${name}"`, req.user?.name || 'Admin');

    return res.status(201).json({
      success: true,
      data: newCat,
    });
  } catch (error: any) {
    console.error('createCategory error:', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const removed = result.rows[0];
    await logActivity(`Removed category: "${removed.name}"`, req.user?.name || 'Admin');

    return res.json({
      success: true,
      message: 'Category removed successfully',
      data: removed,
    });
  } catch (error: any) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
};
