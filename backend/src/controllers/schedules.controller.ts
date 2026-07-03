import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const scheduleSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  venue: z.string().min(2),
  day: z.number().int().min(1).max(10),
  type: z.string().default('SESSION'),
  isBreak: z.boolean().default(false),
  eventId: z.string().uuid().optional(),
  orderIndex: z.number().int().default(0),
});

export const getAllScheduleItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { day } = req.query;
    const where: Record<string, unknown> = {};
    if (day) where.day = parseInt(day as string, 10);

    const items = await prisma.scheduleItem.findMany({
      where,
      include: { event: { select: { id: true, title: true, category: true } } },
      orderBy: [{ day: 'asc' }, { orderIndex: 'asc' }, { startTime: 'asc' }],
    });

    sendSuccess(res, items, 'Schedule retrieved');
  } catch (err) {
    next(err);
  }
};

export const createScheduleItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = scheduleSchema.parse(req.body);
    const item = await prisma.scheduleItem.create({ data: { ...data, date: new Date(data.date) } });
    sendCreated(res, item, 'Schedule item created');
  } catch (err) {
    next(err);
  }
};

export const updateScheduleItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = scheduleSchema.partial().parse(req.body);
    const updateData: Record<string, unknown> = { ...data };
    if (data.date) updateData.date = new Date(data.date as string);
    const item = await prisma.scheduleItem.update({ where: { id: req.params.id }, data: updateData });
    sendSuccess(res, item, 'Schedule item updated');
  } catch (err) {
    next(err);
  }
};

export const deleteScheduleItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.scheduleItem.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Schedule item deleted');
  } catch (err) {
    next(err);
  }
};
