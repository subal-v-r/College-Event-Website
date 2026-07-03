import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { sendError } from '../utils/response';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn('Operational error', { message: err.message, statusCode: err.statusCode });
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.flatten().fieldErrors;
    sendError(res, 'Validation failed', 422, errors);
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as NodeJS.ErrnoException;
    if (prismaErr.code === 'P2002') {
      sendError(res, 'A record with this value already exists', 409);
      return;
    }
    if (prismaErr.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  sendError(res, 'Internal server error', 500);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
