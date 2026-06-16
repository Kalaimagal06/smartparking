import { Router } from 'express';
import { getAllSlots, updateSlotStatus } from '../controllers/slot.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Everyone can view slots
router.get('/', getAllSlots);

// Only admins can update slot status manually (e.g. mark as occupied)
router.put('/:id', authenticateToken, requireAdmin, updateSlotStatus);

export default router;
