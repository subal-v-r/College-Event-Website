import { PrismaClient } from '@prisma/client';
import logger from './utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

prisma.$connect().then(() => {
  logger.info('✅ Database connected');
}).catch((err) => {
  logger.error('❌ Database connection failed', { error: err.message });
  process.exit(1);
});

export default prisma;
