import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { invalidateCache } from '../middleware/cache.middleware';

const prisma = new PrismaClient();

export const getAllSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const slots = await prisma.parkingSlot.findMany();
    
    // Seed slots if empty (for demo purposes)
    if (slots.length === 0) {
      const initialSlots = Array.from({ length: 10 }, (_, i) => ({
        slot_number: `A${i + 1}`,
        status: 'AVAILABLE'
      }));
      await prisma.parkingSlot.createMany({ data: initialSlots });
      const newSlots = await prisma.parkingSlot.findMany();
      res.status(200).json({ success: true, slots: newSlots });
      return;
    }

    res.status(200).json({ success: true, slots });
  } catch (error) {
    next(error);
  }
};

export const updateSlotStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'AVAILABLE', 'OCCUPIED', 'RESERVED'

    const updatedSlot = await prisma.parkingSlot.update({
      where: { id: id as string },
      data: { status }
    });


    // Invalidate the cache for slots
    await invalidateCache('slots');

    res.status(200).json({ success: true, slot: updatedSlot });
  } catch (error) {
    next(error);
  }
};
