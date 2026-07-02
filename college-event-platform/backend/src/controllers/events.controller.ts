import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { EventCategory } from '@prisma/client';

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  shortDescription: z.string().min(10).max(200),
  category: z.nativeEnum(EventCategory),
  venue: z.string().min(2),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  maxParticipants: z.number().int().positive(),
  registrationDeadline: z.string().datetime(),
  coordinatorName: z.string().min(2),
  coordinatorEmail: z.string().email(),
  coordinatorPhone: z.string().min(10),
  prizeFirst: z.string().optional(),
  prizeSecond: z.string().optional(),
  prizeThird: z.string().optional(),
  rules: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  imageUrl: z.string().url().optional(),
});

/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Events]
 *     summary: Get all active events with optional filtering
 */
export const getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, featured, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { shortDescription: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ isFeatured: 'desc' }, { date: 'asc' }],
        select: {
          id: true, title: true, shortDescription: true, category: true,
          venue: true, date: true, startTime: true, endTime: true,
          maxParticipants: true, registrationDeadline: true,
          prizeFirst: true, isFeatured: true, imageUrl: true, tags: true,
          _count: { select: { registrations: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    sendSuccess(res, events, 'Events retrieved', 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by ID
 */
export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id, isActive: true },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) throw new AppError('Event not found', 404);
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event (Admin only)
 *     security:
 *       - bearerAuth: []
 */
export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = eventSchema.parse(req.body);
    const event = await prisma.event.create({ data: { ...data, date: new Date(data.date), registrationDeadline: new Date(data.registrationDeadline) } });
    sendCreated(res, event, 'Event created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Update an event (Admin only)
 *     security:
 *       - bearerAuth: []
 */
export const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = eventSchema.partial().parse(req.body);
    const updateData: Record<string, unknown> = { ...data };
    if (data.date) updateData.date = new Date(data.date as string);
    if (data.registrationDeadline) updateData.registrationDeadline = new Date(data.registrationDeadline as string);

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: updateData,
    });
    sendSuccess(res, event, 'Event updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Soft-delete an event (Admin only)
 *     security:
 *       - bearerAuth: []
 */
export const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.event.update({ where: { id: req.params.id }, data: { isActive: false } });
    sendSuccess(res, null, 'Event deleted successfully');
  } catch (err) {
    next(err);
  }
};
