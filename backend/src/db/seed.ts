import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { initializeDatabase } from './init.js';

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Ethiopian Paraíba Tourmaline', slug: 'paraiba', description: 'Electric neon copper-bearing cuprian tourmaline from Ethiopia.' },
  { id: 'cat-2', name: 'Sapphires', slug: 'sapphire', description: 'Natural Royal Blue, Cornflower, and fancy colored corundum.' },
  { id: 'cat-3', name: 'Padparadscha', slug: 'padparadscha', description: 'Rare lotus-color pinkish-orange sapphire.' },
  { id: 'cat-4', name: 'Rough Gemstones', slug: 'rough', description: 'Direct mine crystal parcels for master lapidaries and investment.' },
  { id: 'cat-5', name: 'African Emeralds', slug: 'emerald', description: 'Deep saturated green beryl from Zambian and East African deposits.' },
  { id: 'cat-6', name: 'Rare & Collector Gemstones', slug: 'rare', description: 'Museum-grade collector stones (Spessartite, Rubies, Spinel, Alexandrite).' },
];

export const INITIAL_GEMSTONES: any[] = [];

export const INITIAL_INQUIRIES: any[] = [];

export const INITIAL_GALLERY: any[] = [];

export async function seedDatabase() {
  await initializeDatabase();
  console.log('[Seeder] Seeding database...');

  // 1. Admin User
  const adminPassword = 'AbelGemstone2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await pool.query(
    `INSERT INTO admin_users (id, email, password_hash, name, role, avatar)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [
      'usr_abel_01',
      'admin@abelgemstone.com',
      passwordHash,
      'Abel Gemstone Executive',
      'Managing Principal & Senior Gemologist',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
    ]
  );
  console.log('[Seeder] Admin user verified (admin@abelgemstone.com).');

  // 2. Categories
  for (const cat of INITIAL_CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (id, name, slug, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description`,
      [cat.id, cat.name, cat.slug, cat.description]
    );
  }
  console.log(`[Seeder] Seeded ${INITIAL_CATEGORIES.length} categories.`);

  // 3. Gemstones
  for (const stone of INITIAL_GEMSTONES) {
    await pool.query(
      `INSERT INTO gemstones (
        id, name, category, sub_category, weight_carats, dimensions,
        shape_cut, color, origin, treatment, clarity, price_usd,
        price_formatted, status, is_rough, cutting_potential, description,
        images, video_url, has_360_view, featured, date_added
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        weight_carats = EXCLUDED.weight_carats,
        dimensions = EXCLUDED.dimensions,
        shape_cut = EXCLUDED.shape_cut,
        color = EXCLUDED.color,
        origin = EXCLUDED.origin,
        treatment = EXCLUDED.treatment,
        clarity = EXCLUDED.clarity,
        price_usd = EXCLUDED.price_usd,
        price_formatted = EXCLUDED.price_formatted,
        status = EXCLUDED.status,
        is_rough = EXCLUDED.is_rough,
        cutting_potential = EXCLUDED.cutting_potential,
        description = EXCLUDED.description,
        images = EXCLUDED.images,
        video_url = EXCLUDED.video_url,
        has_360_view = EXCLUDED.has_360_view,
        featured = EXCLUDED.featured`,
      [
        stone.id,
        stone.name,
        stone.category,
        stone.subCategory || '',
        stone.weightCarats,
        stone.dimensions,
        stone.shapeCut,
        stone.color,
        stone.origin,
        stone.treatment,
        stone.clarity,
        stone.priceUsd,
        stone.priceFormatted,
        stone.status,
        stone.isRough,
        stone.cuttingPotential,
        stone.description,
        JSON.stringify(stone.images),
        stone.videoUrl,
        stone.has360View,
        stone.featured,
        stone.dateAdded
      ]
    );
  }
  console.log(`[Seeder] Seeded ${INITIAL_GEMSTONES.length} gemstones.`);

  // 4. Inquiries
  for (const inq of INITIAL_INQUIRIES) {
    await pool.query(
      `INSERT INTO buyer_inquiries (
        id, name, company, country, email, whatsapp, gemstone_wanted,
        stone_id, stone_name, rough_or_finished, approximate_carat,
        budget_range, message, timestamp, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO NOTHING`,
      [
        inq.id,
        inq.name,
        inq.company,
        inq.country,
        inq.email,
        inq.whatsapp,
        inq.gemstoneWanted,
        inq.stoneId,
        inq.stoneName,
        inq.roughOrFinished,
        inq.approximateCarat,
        inq.budgetRange,
        inq.message,
        inq.timestamp,
        inq.status
      ]
    );
  }
  console.log(`[Seeder] Seeded ${INITIAL_INQUIRIES.length} inquiries.`);

  // 5. Gallery
  for (const gal of INITIAL_GALLERY) {
    await pool.query(
      `INSERT INTO gallery_items (
        id, title, category, image_url, thumbnail_url, description, origin, is_video
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        thumbnail_url = EXCLUDED.thumbnail_url,
        description = EXCLUDED.description,
        origin = EXCLUDED.origin,
        is_video = EXCLUDED.is_video`,
      [
        gal.id,
        gal.title,
        gal.category,
        gal.imageUrl,
        gal.thumbnailUrl,
        gal.description,
        gal.origin,
        gal.isVideo
      ]
    );
  }
  console.log(`[Seeder] Seeded ${INITIAL_GALLERY.length} gallery items.`);

  // 6. Activity Log
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
  await pool.query(
    `INSERT INTO activity_logs (id, action, user_name, timestamp)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [
      'act-init',
      'System initialized with PostgreSQL & seeded with African Paraíba & Sapphire inventory',
      'System Admin',
      timestamp
    ]
  );

  console.log('[Seeder] Database seeding finished successfully.');
}

// Run standalone if executed directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('Seeding script completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}
