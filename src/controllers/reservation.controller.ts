import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { addReservationJob } from '../jobs/queue';
import { getIO } from '../socket';

const prisma = new PrismaClient();

// In auth middleware, we injected `req.user`. We define a custom request type.
interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export const createReservation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { slotId, durationHours } = req.body;
        const userId = req.user?.id;

        if (!slotId || !durationHours || !userId) {
             res.status(400).json({ success: false, message: 'slotId and durationHours are required.' });
             return;
        }

        // Verify slot is available
        const slot = await prisma.parkingSlot.findUnique({ where: { id: parseInt(slotId, 10) } });
        if (!slot || slot.status !== 'AVAILABLE') {
            res.status(400).json({ success: false, message: 'Slot is not available.' });
            return;
        }

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
        const expiryTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

        // Create reservation and update slot status in a transaction
        const [reservation, updatedSlot] = await prisma.$transaction([
            prisma.reservation.create({
                data: {
                    user_id: userId,
                    slot_id: slot.id,
                    booking_date: new Date(),
                    start_time: startTime,
                    end_time: endTime,
                    expiry_time: expiryTime,
                    status: 'ACTIVE'
                }
            }),
            prisma.parkingSlot.update({
                where: { id: slot.id },
                data: { status: 'RESERVED' }
            })
        ]);

        // Broadcast slot update via WebSocket
        const io = getIO();
        io.emit('slot_updated', updatedSlot);

        // Queue expiration job for 2 hours
        await addReservationJob('expireReservation', { reservationId: reservation.id, slotId: slot.id }, 2 * 60 * 60 * 1000);

        res.status(201).json({
            success: true,
            message: 'Reservation created successfully.',
            reservation
        });
    } catch (error) {
        next(error);
    }
};

export const getMyReservations = async (req: AuthRequest, res: Response) => {
    try {
        const reservations = await prisma.reservation.findMany({
            where: { user_id: req.user!.id },
            include: { slot: true },
            orderBy: { booking_date: 'desc' }
        });

        res.json({ success: true, reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const cancelReservation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if reservation exists and belongs to user
        const reservation = await prisma.reservation.findUnique({
            where: { id: parseInt(id as string, 10) }
        });

        if (!reservation) {
            res.status(404).json({ success: false, message: 'Reservation not found' });
            return;
        }

        if (reservation.user_id !== req.user!.id) {
            res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
            return;
        }

        if (reservation.status !== 'ACTIVE') {
            res.status(400).json({ success: false, message: 'Only active reservations can be cancelled' });
            return;
        }

        // Update reservation to CANCELLED and free the slot
        const [updatedReservation, updatedSlot] = await prisma.$transaction([
            prisma.reservation.update({
                where: { id: reservation.id },
                data: { status: 'CANCELLED' }
            }),
            prisma.parkingSlot.update({
                where: { id: reservation.slot_id },
                data: { status: 'AVAILABLE' }
            })
        ]);

        const io = getIO();
        io.emit('slot_updated', updatedSlot);
        io.emit('reservation_cancelled', { reservationId: reservation.id, slotId: updatedSlot.id });

        res.json({
            success: true,
            message: 'Reservation cancelled successfully',
            reservation: updatedReservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
