import { Router } from 'express';
import { createReservation, getMyReservations, cancelReservation } from '../controllers/reservation.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Require auth for reservations
router.use(authenticateToken);

router.post('/', createReservation);
router.get('/my-reservations', getMyReservations);

router.post('/:id/cancel', cancelReservation);
export default router;
