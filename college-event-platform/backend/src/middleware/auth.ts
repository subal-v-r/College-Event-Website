import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendUnauthorized, sendForbidden } from '../utils/response';
import prisma from '../prisma';

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    sendUnauthorized(res, 'No token provided');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId, isActive: true },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      sendUnauthorized(res, 'User not found or deactivated');
      return;
    }

    req.user = { ...payload, id: user.id };
    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'ADMIN') {
    sendForbidden(res, 'Admin access required');
    return;
  }
  next();
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      req.user = { ...payload, id: payload.userId };
    } catch {
      // Token invalid – continue without user
    }
  }
  next();
};
