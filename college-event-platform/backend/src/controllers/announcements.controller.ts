import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const announcementSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  priority: z.number().int().min(0).max(10).default(0),
  isPublished: z.boolean().default(true),
  expiresAt: z.string().datetime().optional(),
});

export const getAllAnnouncements = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
    sendSuccess(res, announcements, 'Announcements retrieved');
  } catch (err) {
    next(err);
  }
};

export const getAllAnnouncementsAdmin = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
    sendSuccess(res, announcements, 'All announcements retrieved');
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = announcementSchema.parse(req.body);
    const announcement = await prisma.announcement.create({
      data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined },
    });
    sendCreated(res, announcement, 'Announcement created');
  } catch (err) {
    next(err);
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = announcementSchema.partial().parse(req.body);
    const updateData: Record<string, unknown> = { ...data };
    if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt as string);
    const announcement = await prisma.announcement.update({ where: { id: req.params.id }, data: updateData });
    sendSuccess(res, announcement, 'Announcement updated');
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Announcement deleted');
  } catch (err) {
    next(err);
  }
};
