import { Router } from 'express';
import {
  getInquiries,
  submitInquiry,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getInquiries);
router.post('/', submitInquiry);
router.put('/:id', requireAuth, updateInquiry);
router.delete('/:id', requireAuth, deleteInquiry);

export default router;
