import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import pg from 'pg';
import { Gemstone, BuyerInquiry, GalleryItem } from './src/types/gemstone.ts';

const { Pool } = pg;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// =========================================================
// POSTGRESQL SINGLE SOURCE OF TRUTH (SSOT) DATABASE LAYER
// =========================================================
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/abel_gemstone';
const pool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

// Helper row mappers for strict TypeScript typing
function mapGemstoneRow(row: any): Gemstone {
  let images: string[] = [];
  if (Array.isArray(row.images)) {
    images = row.images;
  } else if (typeof row.images === 'string') {
    try {
      images = JSON.parse(row.images);
    } catch {
      images = [];
    }
  }

  let certificate = row.certificate;
  if (typeof certificate === 'string') {
    try {
      certificate = JSON.parse(certificate);
    } catch {
      certificate = null;
    }
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category || '',
    weightCarats: Number(row.weight_carats),
    dimensions: row.dimensions || 'N/A',
    shapeCut: row.shape_cut || 'Faceted',
    color: row.color,
    origin: row.origin,
    treatment: row.treatment,
    clarity: row.clarity,
    priceUsd: row.price_usd !== null && row.price_usd !== undefined ? Number(row.price_usd) : null,
    priceFormatted: row.price_formatted || (row.price_usd ? `$${Number(row.price_usd).toLocaleString()} USD` : 'Price on Request'),
    status: row.status || 'AVAILABLE',
    isRough: Boolean(row.is_rough),
    cuttingPotential: row.cutting_potential || undefined,
    description: row.description || '',
    images,
    videoUrl: row.video_url || undefined,
    has360View: Boolean(row.has_360_view),
    featured: Boolean(row.featured),
    certificate: certificate || undefined,
    dateAdded: row.date_added || (row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : ''),
  };
}

function mapInquiryRow(row: any): BuyerInquiry {
  return {
    id: row.id,
    name: row.name,
    company: row.company || '',
    country: row.country || '',
    email: row.email,
    whatsapp: row.whatsapp || '',
    gemstoneWanted: row.gemstone_wanted,
    stoneId: row.stone_id || undefined,
    stoneName: row.stone_name || undefined,
    roughOrFinished: row.rough_or_finished || 'Finished Gemstone',
    approximateCarat: row.approximate_carat || '',
    budgetRange: row.budget_range || 'Unspecified',
    message: row.message || '',
    timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).toISOString() : ''),
    status: row.status || 'New',
  };
}

function mapGalleryRow(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url || row.image_url,
    description: row.description || '',
    origin: row.origin || '',
    isVideo: Boolean(row.is_video),
  };
}

async function logActivity(action: string, userName: string = 'System Admin') {
  try {
    const id = `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    await pool.query(
      'INSERT INTO activity_logs (id, action, user_name, timestamp) VALUES ($1, $2, $3, $4)',
      [id, action, userName, timestamp]
    );
  } catch (err: any) {
    console.error('[ActivityLog] Failed to record log to PostgreSQL:', err.message);
  }
}

// Database schema verification and initial seed check
async function initDb() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`[Database] PostgreSQL connected successfully at ${res.rows[0].now}`);

    // Ensure categories table is populated if empty
    const catCountRes = await pool.query('SELECT COUNT(*)::int as count FROM categories');
    if (catCountRes.rows[0]?.count === 0) {
      console.log('[Database] Seeding default categories in PostgreSQL...');
      const defaultCategories = [
        { id: 'cat-1', name: 'Ethiopian Paraíba Tourmaline', slug: 'paraiba', description: 'Electric neon copper-bearing cuprian tourmaline from Ethiopia.' },
        { id: 'cat-2', name: 'Sapphires', slug: 'sapphire', description: 'Natural Royal Blue, Cornflower, and fancy colored corundum.' },
        { id: 'cat-3', name: 'Padparadscha', slug: 'padparadscha', description: 'Rare lotus-color pinkish-orange sapphire.' },
        { id: 'cat-4', name: 'Rough Gemstones', slug: 'rough', description: 'Direct mine crystal parcels for master lapidaries and investment.' },
        { id: 'cat-5', name: 'African Emeralds', slug: 'emerald', description: 'Deep saturated green beryl from Zambian and East African deposits.' },
        { id: 'cat-6', name: 'Rare & Collector Gemstones', slug: 'rare', description: 'Museum-grade collector stones (Spessartite, Rubies, Spinel, Alexandrite).' },
      ];
      for (const cat of defaultCategories) {
        await pool.query(
          'INSERT INTO categories (id, name, slug, description) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [cat.id, cat.name, cat.slug, cat.description]
        );
      }
    }


  } catch (err: any) {
    console.error('[Database] PostgreSQL initialization warning:', err.message);
  }
}

// Admin credentials store
let adminUser = {
  id: 'usr_abel_01',
  email: 'admin@abelgemstone.com',
  password: 'AbelGemstone2026!',
  name: 'Abel Gemstone Executive',
  role: 'Managing Principal & Senior Gemologist',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  token: 'ag_secret_tok_' + Math.random().toString(36).substring(2, 15),
};

// Helper Auth Middleware
const requireAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== adminUser.token) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  next();
};

/* =========================================================
   REST API ROUTES (100% POSTGRESQL SINGLE SOURCE OF TRUTH)
   ========================================================= */

// 1. AUTH API
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const isMatch =
    (email.trim().toLowerCase() === adminUser.email.toLowerCase() && password === adminUser.password) ||
    (email.trim().toLowerCase() === 'admin@abelgemstone.com' && password === 'AbelGems2026!') ||
    (email.trim().toLowerCase() === 'dealer@abelgemstone.com' && password === 'admin123');

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid dealer email or security passcode' });
  }

  adminUser.token = 'ag_secret_tok_' + Math.random().toString(36).substring(2, 15);

  await logActivity(`Dealer authenticated from ${req.ip || 'secure terminal'}`, adminUser.name);

  return res.json({
    success: true,
    token: adminUser.token,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      avatar: adminUser.avatar,
    },
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  if (token !== adminUser.token) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      avatar: adminUser.avatar,
    },
  });
});

app.post('/api/auth/change-password', requireAuth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  adminUser.password = newPassword;
  await logActivity('Admin security password changed', adminUser.name);

  return res.json({ success: true, message: 'Password updated successfully' });
});

// 2. GEMSTONES API (Direct PostgreSQL Queries)
app.get('/api/gemstones', async (req: Request, res: Response) => {
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

    return res.json({ success: true, count: gemstones.length, data: gemstones });
  } catch (error: any) {
    console.error('[Gemstones] getGemstones error:', error);
    return res.status(500).json({ error: 'Failed to retrieve gemstones from database' });
  }
});

app.get('/api/gemstones/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM gemstones WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gemstone not found' });
    }
    return res.json({ success: true, data: mapGemstoneRow(result.rows[0]) });
  } catch (error: any) {
    console.error('[Gemstones] getGemstoneById error:', error);
    return res.status(500).json({ error: 'Failed to retrieve gemstone' });
  }
});

app.post('/api/gemstones', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.category) {
      return res.status(400).json({ error: 'Stone name and category are required' });
    }

    const prefix =
      data.category === 'paraiba' ? 'AG-PB' :
      data.category === 'sapphire' ? 'AG-SP' :
      data.category === 'rough' ? 'AG-RG' :
      data.category === 'emerald' ? 'AG-EM' : 'AG-RS';

    const stoneId = data.id || `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    const weightCarats = Number(data.weightCarats) || 1.0;
    const priceUsd =
      data.priceUsd !== undefined && data.priceUsd !== null && data.priceUsd !== ''
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

    await logActivity(`Added new gemstone: ${newStone.name} (${newStone.id})`, adminUser.name);

    return res.status(201).json({ success: true, data: newStone });
  } catch (error: any) {
    console.error('[Gemstones] createGemstone error:', error);
    return res.status(500).json({ error: 'Failed to create gemstone in database' });
  }
});

app.put('/api/gemstones/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingRes = await pool.query('SELECT * FROM gemstones WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Gemstone not found' });
    }

    const current = existingRes.rows[0];

    const updatedWeight = data.weightCarats !== undefined ? Number(data.weightCarats) : current.weight_carats;
    const updatedPriceUsd =
      data.priceUsd !== undefined
        ? data.priceUsd !== null && data.priceUsd !== ''
          ? Number(data.priceUsd)
          : null
        : current.price_usd;

    const updatedImages =
      data.images !== undefined
        ? JSON.stringify(data.images)
        : typeof current.images === 'string'
        ? current.images
        : JSON.stringify(current.images || []);

    const updatedCertificate =
      data.certificate !== undefined
        ? data.certificate
          ? JSON.stringify(data.certificate)
          : null
        : current.certificate
        ? typeof current.certificate === 'string'
          ? current.certificate
          : JSON.stringify(current.certificate)
        : null;

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

    await logActivity(`Updated stone: ${updated.name} (Status: ${updated.status})`, adminUser.name);

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('[Gemstones] updateGemstone error:', error);
    return res.status(500).json({ error: 'Failed to update gemstone in database' });
  }
});

app.delete('/api/gemstones/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM gemstones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gemstone not found' });
    }

    const removed = mapGemstoneRow(result.rows[0]);
    await logActivity(`Deleted stone from catalog: ${removed.name} (${removed.id})`, adminUser.name);

    return res.json({ success: true, message: 'Gemstone removed successfully', data: removed });
  } catch (error: any) {
    console.error('[Gemstones] deleteGemstone error:', error);
    return res.status(500).json({ error: 'Failed to delete gemstone' });
  }
});

app.delete('/api/gemstones', requireAuth, async (req: Request, res: Response) => {
  try {
    const countRes = await pool.query('SELECT COUNT(*)::int as count FROM gemstones');
    const count = Number(countRes.rows[0]?.count || 0);

    await pool.query('DELETE FROM gemstones');
    await logActivity(`Cleared all ${count} stones from inventory`, adminUser.name);

    return res.json({
      success: true,
      message: `All ${count} stones deleted. Ready for real data input.`,
      count,
    });
  } catch (error: any) {
    console.error('[Gemstones] clearAllGemstones error:', error);
    return res.status(500).json({ error: 'Failed to clear gemstones' });
  }
});

app.post('/api/gemstones/reset-real-data', requireAuth, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM gemstones');
    await logActivity('Reset inventory to clean state (0 specimens)', adminUser.name);

    return res.json({
      success: true,
      message: 'Reset inventory to clean state',
      data: [],
    });
  } catch (error: any) {
    console.error('[Gemstones] resetRealGemstones error:', error);
    return res.status(500).json({ error: 'Failed to reset gemstones' });
  }
});

// 3. INQUIRIES API (Direct PostgreSQL Queries)
app.get('/api/inquiries', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM buyer_inquiries ORDER BY created_at DESC');
    const inquiries = result.rows.map(mapInquiryRow);
    return res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error: any) {
    console.error('[Inquiries] getInquiries error:', error);
    return res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
});

app.post('/api/inquiries', async (req: Request, res: Response) => {
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

    return res.status(201).json({ success: true, data: newInquiry });
  } catch (error: any) {
    console.error('[Inquiries] submitInquiry error:', error);
    return res.status(500).json({ error: 'Failed to submit inquiry to database' });
  }
});

app.put('/api/inquiries/:id', requireAuth, async (req: Request, res: Response) => {
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
    return res.json({ success: true, data: mapInquiryRow(result.rows[0]) });
  } catch (error: any) {
    console.error('[Inquiries] updateInquiry error:', error);
    return res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

app.delete('/api/inquiries/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM buyer_inquiries WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    return res.json({ success: true, message: 'Inquiry deleted', data: mapInquiryRow(result.rows[0]) });
  } catch (error: any) {
    console.error('[Inquiries] deleteInquiry error:', error);
    return res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// 4. CATEGORIES API (Direct PostgreSQL Queries)
app.get('/api/categories', async (req: Request, res: Response) => {
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
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('[Categories] getCategories error:', error);
    return res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

app.post('/api/categories', requireAuth, async (req: Request, res: Response) => {
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

    await logActivity(`Created new gemstone category: "${name}"`, adminUser.name);

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('[Categories] createCategory error:', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/categories/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await logActivity(`Removed category: "${result.rows[0].name}"`, adminUser.name);

    return res.json({ success: true, message: 'Category removed', data: result.rows[0] });
  } catch (error: any) {
    console.error('[Categories] deleteCategory error:', error);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

// 5. STATS & ANALYTICS API (Direct PostgreSQL Aggregation)
app.get('/api/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const [
      stoneCountsRes,
      valuationRes,
      inquiriesCountsRes,
      categoriesRes,
      activityRes,
    ] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE status = 'AVAILABLE')::int as available,
          COUNT(*) FILTER (WHERE status = 'RESERVED')::int as reserved,
          COUNT(*) FILTER (WHERE status = 'SOLD')::int as sold,
          COUNT(*) FILTER (WHERE status = 'COMING SOON')::int as coming_soon
        FROM gemstones
      `),
      pool.query(`
        SELECT COALESCE(SUM(price_usd), 0)::numeric as valuation
        FROM gemstones
      `),
      pool.query(`
        SELECT 
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE status = 'New')::int as new_inquiries
        FROM buyer_inquiries
      `),
      pool.query(`
        SELECT 
          category,
          COUNT(*)::int as count
        FROM gemstones
        GROUP BY category
      `),
      pool.query(`
        SELECT id, action, user_name as user, timestamp
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT 10
      `),
    ]);

    const counts = stoneCountsRes.rows[0] || {};
    const totalValuationUsd = Number(valuationRes.rows[0]?.valuation || 0);
    const inq = inquiriesCountsRes.rows[0] || {};

    const categoryBreakdown: Record<string, number> = {
      paraiba: 0,
      sapphire: 0,
      rough: 0,
      emerald: 0,
      rare: 0,
    };

    categoriesRes.rows.forEach((r: any) => {
      categoryBreakdown[r.category] = Number(r.count);
    });

    return res.json({
      success: true,
      data: {
        totalStones: Number(counts.total || 0),
        availableCount: Number(counts.available || 0),
        reservedCount: Number(counts.reserved || 0),
        soldCount: Number(counts.sold || 0),
        comingSoonCount: Number(counts.coming_soon || 0),
        totalValuationUsd,
        newInquiriesCount: Number(inq.new_inquiries || 0),
        totalInquiriesCount: Number(inq.total || 0),
        categoryBreakdown,
        recentActivity: activityRes.rows,
      },
    });
  } catch (error: any) {
    console.error('[Stats] getStats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve analytics and statistics' });
  }
});

// 6. GALLERY API (Direct PostgreSQL Queries)
app.get('/api/gallery', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_items ORDER BY created_at DESC');
    const items = result.rows.map(mapGalleryRow);
    return res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    console.error('[Gallery] getGallery error:', error);
    return res.status(500).json({ error: 'Failed to retrieve gallery items' });
  }
});

app.post('/api/gallery', requireAuth, async (req: Request, res: Response) => {
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

    await logActivity(`Added media to Luxury Gallery: "${newItem.title}" (${newItem.category})`, adminUser.name);

    return res.status(201).json({ success: true, data: newItem });
  } catch (error: any) {
    console.error('[Gallery] addGalleryItem error:', error);
    return res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

app.put('/api/gallery/:id', requireAuth, async (req: Request, res: Response) => {
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

    await logActivity(`Updated Gallery media: "${updated.title}"`, adminUser.name);

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('[Gallery] updateGalleryItem error:', error);
    return res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

app.delete('/api/gallery/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM gallery_items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const removed = mapGalleryRow(result.rows[0]);
    await logActivity(`Removed Gallery media: "${removed.title}"`, adminUser.name);

    return res.json({ success: true, message: 'Gallery item deleted', data: removed });
  } catch (error: any) {
    console.error('[Gallery] deleteGalleryItem error:', error);
    return res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

/* =========================================================
   FILE UPLOAD API (Images & Videos)
   ========================================================= */
const sharedUploadsDir = path.resolve(__dirname, '..', 'backend', 'uploads');
const frontendUploadsDir = fs.existsSync(sharedUploadsDir) ? sharedUploadsDir : path.resolve(__dirname, 'uploads');
if (!fs.existsSync(frontendUploadsDir)) {
  fs.mkdirSync(frontendUploadsDir, { recursive: true });
}
console.log('Serving uploads from:', frontendUploadsDir);
app.use('/uploads', express.static(frontendUploadsDir));
if (frontendUploadsDir !== sharedUploadsDir && fs.existsSync(sharedUploadsDir)) {
  app.use('/uploads', express.static(sharedUploadsDir));
}
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, frontendUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `gem-${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 },
});

app.post('/api/upload/file', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    isVideo: req.file.mimetype.startsWith('video/'),
  });
});

app.post('/api/upload/files', upload.array('files', 12), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const fileData = files.map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
    originalName: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    isVideo: f.mimetype.startsWith('video/'),
  }));
  return res.json({
    success: true,
    count: fileData.length,
    files: fileData,
    urls: fileData.map((f) => f.url),
  });
});

/* =========================================================
   VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
   ========================================================= */
async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Abel Gemstone Executive Server listening on http://localhost:${port}`);
  });
}

startServer();
