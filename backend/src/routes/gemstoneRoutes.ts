import { Router } from 'express';
import {
  getGemstones,
  getGemstoneById,
  createGemstone,
  updateGemstone,
  deleteGemstone,
  clearAllGemstones,
  resetRealGemstones,
} from '../controllers/gemstoneController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getGemstones);
router.post('/reset-real-data', requireAuth, resetRealGemstones);
router.delete('/', requireAuth, clearAllGemstones);
router.get('/:id', getGemstoneById);
router.post('/', requireAuth, createGemstone);
router.put('/:id', requireAuth, updateGemstone);
router.delete('/:id', requireAuth, deleteGemstone);

export default router;
