import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const speakerSchema = z.object({
  name: z.string().min(2),
  designation: z.string().min(2),
  organization: z.string().min(2),
  bio: z.string().min(10),
  photoUrl: z.string().url().optional(),
  sessionTitle: z.string().min(5),
  sessionDate: z.string().datetime(),
  sessionTime: z.string(),
  venue: z.string().min(2),
  isKeynote: z.boolean().default(false),
});

export const getAllSpeakers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const speakers = await prisma.speaker.findMany({
      where: { isActive: true },
      orderBy: [{ isKeynote: 'desc' }, { sessionDate: 'asc' }],
    });
    sendSuccess(res, speakers, 'Speakers retrieved');
  } catch (err) {
    next(err);
  }
};

export const getSpeakerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const speaker = await prisma.speaker.findUnique({ where: { id: req.params.id, isActive: true } });
    if (!speaker) throw new AppError('Speaker not found', 404);
    sendSuccess(res, speaker);
  } catch (err) {
    next(err);
  }
};

export const createSpeaker = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = speakerSchema.parse(req.body);
    const speaker = await prisma.speaker.create({ data: { ...data, sessionDate: new Date(data.sessionDate) } });
    sendCreated(res, speaker, 'Speaker created');
  } catch (err) {
    next(err);
  }
};

export const updateSpeaker = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = speakerSchema.partial().parse(req.body);
    const updateData: Record<string, unknown> = { ...data };
    if (data.sessionDate) updateData.sessionDate = new Date(data.sessionDate as string);
    const speaker = await prisma.speaker.update({ where: { id: req.params.id }, data: updateData });
    sendSuccess(res, speaker, 'Speaker updated');
  } catch (err) {
    next(err);
  }
};

export const deleteSpeaker = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.speaker.update({ where: { id: req.params.id }, data: { isActive: false } });
    sendSuccess(res, null, 'Speaker removed');
  } catch (err) {
    next(err);
  }
};
