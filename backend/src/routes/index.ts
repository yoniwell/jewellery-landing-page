import { Router } from 'express';
import authRoutes from './authRoutes.js';
import gemstoneRoutes from './gemstoneRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import statsRoutes from './statsRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/gemstones', gemstoneRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/categories', categoryRoutes);
router.use('/gallery', galleryRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Abel Gemstone Executive API',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString(),
  });
});

export default router;
