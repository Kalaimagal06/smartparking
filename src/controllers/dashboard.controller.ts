import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalSlots = await prisma.parkingSlot.count();
    const bookedSlots = await prisma.parkingSlot.count({ where: { status: 'RESERVED' } });
    const occupiedSlots = await prisma.parkingSlot.count({ where: { status: 'OCCUPIED' } });
    const availableSlots = totalSlots - (bookedSlots + occupiedSlots);

    // Get today's start and end date
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysReservations = await prisma.reservation.count({
      where: {
        booking_date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSlots,
        bookedSlots,
        availableSlots,
        todaysReservations,
        occupiedSlots
      }
    });
  } catch (error) {
    next(error);
  }
};
