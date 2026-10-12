import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_GEMSTONES, INITIAL_INQUIRIES, GALLERY_ITEMS } from './src/data/gemstoneInventory.ts';
import { Gemstone, BuyerInquiry, GalleryItem } from './src/types/gemstone.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory persistent data store seeded with luxury inventory
let gemstonesDb: Gemstone[] = [...INITIAL_GEMSTONES];
let inquiriesDb: BuyerInquiry[] = [...INITIAL_INQUIRIES];
let galleryDb: GalleryItem[] = [...GALLERY_ITEMS];

// Dynamic categories list manageable by the owner without a developer
let categoriesDb: Array<{ id: string; name: string; slug: string; description: string; stoneCount?: number }> = [
  { id: 'cat-1', name: 'Ethiopian Paraíba Tourmaline', slug: 'paraiba', description: 'Electric neon copper-bearing cuprian tourmaline from Ethiopia.' },
  { id: 'cat-2', name: 'Sapphires', slug: 'sapphire', description: 'Natural Royal Blue, Cornflower, and fancy colored corundum.' },
  { id: 'cat-3', name: 'Padparadscha', slug: 'padparadscha', description: 'Rare lotus-color pinkish-orange sapphire.' },
  { id: 'cat-4', name: 'Rough Gemstones', slug: 'rough', description: 'Direct mine crystal parcels for master lapidaries and investment.' },
  { id: 'cat-5', name: 'African Emeralds', slug: 'emerald', description: 'Deep saturated green beryl from Zambian and East African deposits.' },
  { id: 'cat-6', name: 'Rare & Collector Gemstones', slug: 'rare', description: 'Museum-grade collector stones (Spessartite, Rubies, Spinel, Alexandrite).' },
];

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

// Activity log
let activityLogs: Array<{ id: string; action: string; user: string; timestamp: string }> = [
  {
    id: 'act-1',
    action: 'System initialized with Ethiopian Paraíba & Ceylon Sapphire parcels',
    user: 'System Admin',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  },
];

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
   REST API ROUTES
   ========================================================= */

// 1. AUTH API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Accept primary admin credentials (or demo access)
  const isMatch = (email.trim().toLowerCase() === adminUser.email.toLowerCase() && password === adminUser.password) ||
                  (email.trim().toLowerCase() === 'admin@abelgemstone.com' && password === 'AbelGems2026!') ||
                  (email.trim().toLowerCase() === 'dealer@abelgemstone.com' && password === 'admin123');

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid dealer email or security passcode' });
  }

  // Refresh token
  adminUser.token = 'ag_secret_tok_' + Math.random().toString(36).substring(2, 15);

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Dealer authenticated from ${req.ip || 'secure terminal'}`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

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

app.post('/api/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  adminUser.password = newPassword;
  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: 'Admin security password changed',
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, message: 'Password updated successfully' });
});

// 2. GEMSTONES API
app.get('/api/gemstones', (req: Request, res: Response) => {
  const { category, status, isRough } = req.query;
  let filtered = [...gemstonesDb];

  if (category && category !== 'all') {
    filtered = filtered.filter((g) => g.category === category);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((g) => g.status === status);
  }
  if (isRough !== undefined) {
    filtered = filtered.filter((g) => g.isRough === (isRough === 'true'));
  }

  return res.json({ success: true, count: filtered.length, data: filtered });
});

app.get('/api/gemstones/:id', (req: Request, res: Response) => {
  const stone = gemstonesDb.find((g) => g.id === req.params.id);
  if (!stone) {
    return res.status(404).json({ error: 'Gemstone not found' });
  }
  return res.json({ success: true, data: stone });
});

app.post('/api/gemstones', requireAuth, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.category) {
    return res.status(400).json({ error: 'Stone name and category are required' });
  }

  const prefix = data.category === 'paraiba' ? 'AG-PB' :
                 data.category === 'sapphire' ? 'AG-SP' :
                 data.category === 'rough' ? 'AG-RG' :
                 data.category === 'emerald' ? 'AG-EM' : 'AG-RS';

  const newStone: Gemstone = {
    id: data.id || `${prefix}-${Math.floor(100 + Math.random() * 900)}`,
    name: data.name,
    category: data.category,
    subCategory: data.subCategory || '',
    weightCarats: Number(data.weightCarats) || 1.0,
    dimensions: data.dimensions || 'N/A',
    shapeCut: data.shapeCut || 'Faceted',
    color: data.color || 'Vivid',
    origin: data.origin || 'Ethiopia',
    treatment: data.treatment || 'Natural / Unheated',
    clarity: data.clarity || 'Eye Clean',
    priceUsd: data.priceUsd ? Number(data.priceUsd) : null,
    priceFormatted: data.priceFormatted || 'Price on Request',
    status: data.status || 'AVAILABLE',
    isRough: Boolean(data.isRough),
    cuttingPotential: data.cuttingPotential,
    description: data.description || '',
    images: Array.isArray(data.images) && data.images.length > 0 
      ? data.images 
      : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'],
    videoUrl: data.videoUrl,
    has360View: Boolean(data.has360View),
    featured: Boolean(data.featured),
    certificate: data.certificate,
    dateAdded: new Date().toISOString().slice(0, 10),
  };

  gemstonesDb.unshift(newStone);

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Added new gemstone: ${newStone.name} (${newStone.id})`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.status(201).json({ success: true, data: newStone });
});

app.put('/api/gemstones/:id', requireAuth, (req: Request, res: Response) => {
  const index = gemstonesDb.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gemstone not found' });
  }

  const updated: Gemstone = {
    ...gemstonesDb[index],
    ...req.body,
    id: req.params.id, // Immutable ID
  };

  gemstonesDb[index] = updated;

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Updated stone: ${updated.name} (Status: ${updated.status})`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, data: updated });
});

app.delete('/api/gemstones', requireAuth, (req: Request, res: Response) => {
  const count = gemstonesDb.length;
  gemstonesDb = [];

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Cleared all ${count} demo stones from inventory`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, message: `All ${count} stones deleted. Ready for real data input.`, count });
});

app.post('/api/gemstones/reset-real-data', requireAuth, (req: Request, res: Response) => {
  gemstonesDb = [...INITIAL_GEMSTONES];

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Populated authentic African gemstone inventory (${gemstonesDb.length} specimens)`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, message: 'Loaded authentic African gemstone inventory', data: gemstonesDb });
});

app.delete('/api/gemstones/:id', requireAuth, (req: Request, res: Response) => {
  const index = gemstonesDb.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gemstone not found' });
  }

  const removed = gemstonesDb.splice(index, 1)[0];

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Deleted stone from catalog: ${removed.name} (${removed.id})`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, message: 'Gemstone removed successfully', data: removed });
});

// 3. INQUIRIES API
app.get('/api/inquiries', requireAuth, (req: Request, res: Response) => {
  return res.json({ success: true, count: inquiriesDb.length, data: inquiriesDb });
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.email || !data.gemstoneWanted) {
    return res.status(400).json({ error: 'Name, email, and gemstone wanted are required' });
  }

  const newInquiry: BuyerInquiry = {
    id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name,
    company: data.company || '',
    country: data.country || 'International',
    email: data.email,
    whatsapp: data.whatsapp || '',
    gemstoneWanted: data.gemstoneWanted,
    stoneId: data.stoneId,
    stoneName: data.stoneName,
    roughOrFinished: data.roughOrFinished || 'Finished Gemstone',
    approximateCarat: data.approximateCarat || '',
    budgetRange: data.budgetRange || 'Unspecified',
    message: data.message || '',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    status: 'New',
  };

  inquiriesDb.unshift(newInquiry);

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `New buyer inquiry from ${newInquiry.name} (${newInquiry.country}) for ${newInquiry.gemstoneWanted}`,
    user: 'Public Portal',
    timestamp: newInquiry.timestamp,
  });

  return res.status(201).json({ success: true, data: newInquiry });
});

app.put('/api/inquiries/:id', requireAuth, (req: Request, res: Response) => {
  const index = inquiriesDb.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  inquiriesDb[index] = {
    ...inquiriesDb[index],
    ...req.body,
    id: req.params.id,
  };

  return res.json({ success: true, data: inquiriesDb[index] });
});

app.delete('/api/inquiries/:id', requireAuth, (req: Request, res: Response) => {
  const index = inquiriesDb.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  const removed = inquiriesDb.splice(index, 1)[0];
  return res.json({ success: true, message: 'Inquiry deleted', data: removed });
});

// 4. CATEGORIES API (Owner dynamic category creation)
app.get('/api/categories', (req: Request, res: Response) => {
  const withCounts = categoriesDb.map((c) => ({
    ...c,
    stoneCount: gemstonesDb.filter((g) => g.category === c.slug).length,
  }));
  return res.json({ success: true, data: withCounts });
});

app.post('/api/categories', requireAuth, (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const existing = categoriesDb.find((c) => c.slug === slug);
  if (existing) {
    return res.status(400).json({ error: 'Category with this name already exists' });
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    description: description || `Selected ${name} specimens direct from African sources.`,
  };

  categoriesDb.push(newCat);

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Created new gemstone category: "${name}"`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.status(201).json({ success: true, data: newCat });
});

app.delete('/api/categories/:id', requireAuth, (req: Request, res: Response) => {
  const index = categoriesDb.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const removed = categoriesDb.splice(index, 1)[0];
  return res.json({ success: true, message: 'Category removed', data: removed });
});

// 5. STATS & ANALYTICS API
app.get('/api/stats', requireAuth, (req: Request, res: Response) => {
  const totalStones = gemstonesDb.length;
  const availableCount = gemstonesDb.filter((g) => g.status === 'AVAILABLE').length;
  const reservedCount = gemstonesDb.filter((g) => g.status === 'RESERVED').length;
  const soldCount = gemstonesDb.filter((g) => g.status === 'SOLD').length;
  const comingSoonCount = gemstonesDb.filter((g) => g.status === 'COMING SOON').length;

  const totalValuationUsd = gemstonesDb.reduce((sum, g) => sum + (g.priceUsd || 0), 0);
  const newInquiriesCount = inquiriesDb.filter((i) => i.status === 'New').length;
  const totalInquiriesCount = inquiriesDb.length;

  const categoryBreakdown = {
    paraiba: gemstonesDb.filter((g) => g.category === 'paraiba').length,
    sapphire: gemstonesDb.filter((g) => g.category === 'sapphire').length,
    rough: gemstonesDb.filter((g) => g.category === 'rough').length,
    emerald: gemstonesDb.filter((g) => g.category === 'emerald').length,
    rare: gemstonesDb.filter((g) => g.category === 'rare').length,
  };

  return res.json({
    success: true,
    data: {
      totalStones,
      availableCount,
      reservedCount,
      soldCount,
      comingSoonCount,
      totalValuationUsd,
      newInquiriesCount,
      totalInquiriesCount,
      categoryBreakdown,
      recentActivity: activityLogs.slice(0, 10),
    },
  });
});

// 6. GALLERY API (Owner media and photography management)
app.get('/api/gallery', (req: Request, res: Response) => {
  return res.json({ success: true, count: galleryDb.length, data: galleryDb });
});

app.post('/api/gallery', requireAuth, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.title || !data.imageUrl) {
    return res.status(400).json({ error: 'Title and image URL are required' });
  }

  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: data.title,
    category: data.category || 'Paraíba',
    imageUrl: data.imageUrl,
    thumbnailUrl: data.thumbnailUrl || data.imageUrl,
    description: data.description || '',
    origin: data.origin || '',
    isVideo: Boolean(data.isVideo),
  };

  galleryDb.unshift(newItem);

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Added media to Luxury Gallery: "${newItem.title}" (${newItem.category})`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.status(201).json({ success: true, data: newItem });
});

app.put('/api/gallery/:id', requireAuth, (req: Request, res: Response) => {
  const index = galleryDb.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  galleryDb[index] = {
    ...galleryDb[index],
    ...req.body,
    id: req.params.id,
  };

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Updated Gallery media: "${galleryDb[index].title}"`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, data: galleryDb[index] });
});

app.delete('/api/gallery/:id', requireAuth, (req: Request, res: Response) => {
  const index = galleryDb.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  const removed = galleryDb.splice(index, 1)[0];

  activityLogs.unshift({
    id: `act-${Date.now()}`,
    action: `Removed Gallery media: "${removed.title}"`,
    user: adminUser.name,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
  });

  return res.json({ success: true, message: 'Gallery item deleted', data: removed });
});

/* =========================================================
   VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
   ========================================================= */
async function startServer() {
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
    console.log(`Abel Gemstone Executive Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
