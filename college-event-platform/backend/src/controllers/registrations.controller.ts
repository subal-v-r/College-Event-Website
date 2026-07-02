import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const registrationSchema = z.object({
  eventId: z.string().uuid(),
  registerNumber: z.string().min(3),
  department: z.string().min(2),
  yearOfStudy: z.number().int().min(1).max(6),
  phone: z.string().min(10).max(15),
  notes: z.string().optional(),
});

/**
 * @openapi
 * /registrations:
 *   post:
 *     tags: [Registrations]
 *     summary: Register current user for an event
 *     security:
 *       - bearerAuth: []
 */
export const registerForEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registrationSchema.parse(req.body);
    const userId = req.user!.userId;

    // Check event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: data.eventId, isActive: true },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) throw new AppError('Event not found', 404);
    if (new Date() > event.registrationDeadline) throw new AppError('Registration deadline has passed', 400);
    if (event._count.registrations >= event.maxParticipants) throw new AppError('Event is fully booked', 409);

    // Check duplicate registration
    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId: data.eventId } },
    });
    if (existing) throw new AppError('Already registered for this event', 409);

    const registration = await prisma.registration.create({
      data: { ...data, userId, status: 'CONFIRMED' },
      include: { event: { select: { title: true, date: true, venue: true } } },
    });

    sendCreated(res, registration, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /registrations/my:
 *   get:
 *     tags: [Registrations]
 *     summary: Get all registrations for current user
 *     security:
 *       - bearerAuth: []
 */
export const getMyRegistrations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.user!.userId },
      include: {
        event: {
          select: {
            id: true, title: true, category: true, venue: true,
            date: true, startTime: true, endTime: true, imageUrl: true,
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });

    sendSuccess(res, registrations, 'Registrations retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /registrations:
 *   get:
 *     tags: [Registrations]
 *     summary: Get all registrations (Admin only)
 *     security:
 *       - bearerAuth: []
 */
export const getAllRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId, status, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          event: { select: { title: true, date: true, category: true } },
        },
        orderBy: { registeredAt: 'desc' },
      }),
      prisma.registration.count({ where }),
    ]);

    sendSuccess(res, registrations, 'All registrations retrieved', 200, {
      total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /registrations/{id}:
 *   delete:
 *     tags: [Registrations]
 *     summary: Cancel a registration
 *     security:
 *       - bearerAuth: []
 */
export const cancelRegistration = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: req.params.id },
    });

    if (!registration) throw new AppError('Registration not found', 404);

    const isOwner = registration.userId === req.user!.userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isOwner && !isAdmin) throw new AppError('Not authorized to cancel this registration', 403);

    await prisma.registration.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    sendSuccess(res, null, 'Registration cancelled');
  } catch (err) {
    next(err);
  }
};
