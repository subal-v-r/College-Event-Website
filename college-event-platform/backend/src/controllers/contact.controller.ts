import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

export const submitContact = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = contactSchema.parse(req.body);
    const contactForm = await prisma.contactForm.create({
      data: { ...data, userId: req.user?.userId },
    });
    sendCreated(res, { id: contactForm.id }, 'Message submitted successfully. We will get back to you soon.');
  } catch (err) {
    next(err);
  }
};

export const getAllContactForms = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const forms = await prisma.contactForm.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, forms, 'Contact forms retrieved');
  } catch (err) {
    next(err);
  }
};

export const markContactRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.contactForm.update({ where: { id: req.params.id }, data: { isRead: true } });
    sendSuccess(res, null, 'Marked as read');
  } catch (err) {
    next(err);
  }
};
