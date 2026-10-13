import { Gemstone, BuyerInquiry, GalleryItem } from '../types/index.js';

export function mapGemstoneRow(row: any): Gemstone {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category || '',
    weightCarats: Number(row.weight_carats),
    dimensions: row.dimensions || '',
    shapeCut: row.shape_cut || '',
    color: row.color || '',
    origin: row.origin || '',
    treatment: row.treatment || '',
    clarity: row.clarity || '',
    priceUsd: row.price_usd !== null && row.price_usd !== undefined ? Number(row.price_usd) : null,
    priceFormatted: row.price_formatted || 'Price on Request',
    status: row.status || 'AVAILABLE',
    isRough: Boolean(row.is_rough),
    cuttingPotential: row.cutting_potential || undefined,
    description: row.description || '',
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
    videoUrl: row.video_url || undefined,
    has360View: Boolean(row.has_360_view),
    featured: Boolean(row.featured),
    certificate: row.certificate ? (typeof row.certificate === 'string' ? JSON.parse(row.certificate) : row.certificate) : undefined,
    dateAdded: row.date_added || (row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : ''),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export function mapInquiryRow(row: any): BuyerInquiry {
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
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
}

export function mapGalleryRow(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url || row.image_url,
    description: row.description || '',
    origin: row.origin || '',
    isVideo: Boolean(row.is_video),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
}

export async function logActivity(action: string, userName: string = 'System Admin') {
  try {
    const { pool } = await import('../config/db.js');
    const id = `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    await pool.query(
      'INSERT INTO activity_logs (id, action, user_name, timestamp) VALUES ($1, $2, $3, $4)',
      [id, action, userName, timestamp]
    );
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }
}
