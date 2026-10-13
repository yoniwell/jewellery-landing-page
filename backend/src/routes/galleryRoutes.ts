import { Router } from 'express';
import {
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getGallery);
router.post('/', requireAuth, addGalleryItem);
router.put('/:id', requireAuth, updateGalleryItem);
router.delete('/:id', requireAuth, deleteGalleryItem);

export default router;
