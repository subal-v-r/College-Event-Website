import app from './app';
import { config } from './config/config';
import logger from './utils/logger';
import prisma from './prisma';

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 TECHFEST API running on port ${config.PORT}`);
  logger.info(`📖 API Docs: http://localhost:${config.PORT}/api/docs`);
  logger.info(`❤️  Health:   http://localhost:${config.PORT}/health`);
  logger.info(`📊 Metrics:  http://localhost:${config.PORT}/metrics`);
  logger.info(`🏷️  Version:  http://localhost:${config.PORT}/version`);
  logger.info(`🌍 Env:      ${config.NODE_ENV}`);
});

// ── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('✅ Server closed. Database disconnected.');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes > 10s
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason });
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

export default server;
