import { Response } from 'express';
import { pool } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStats = async (req: AuthRequest, res: Response) => {
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
    console.error('getStats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve analytics and statistics' });
  }
};
