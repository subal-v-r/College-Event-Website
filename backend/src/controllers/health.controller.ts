import { Request, Response } from 'express';
import os from 'os';
import process from 'process';
import { config } from '../config/config';
import prisma from '../prisma';

// ── HTTP request counters ───────────────────────────────────────────────────
let totalRequests = 0;
let totalResponseTimeMs = 0;

export const trackRequest = (responseTimeMs: number): void => {
  totalRequests++;
  totalResponseTimeMs += responseTimeMs;
};

const startTime = Date.now();

const bytesToMB = (bytes: number): number => Math.round((bytes / 1024 / 1024) * 100) / 100;
const formatUptime = (seconds: number): string => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Kubernetes health probe endpoint
 *     security: []
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(process.uptime()),
      database: 'connected',
      version: config.APP_VERSION,
      environment: config.NODE_ENV,
    });
  } catch {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
};

/**
 * @openapi
 * /metrics:
 *   get:
 *     tags: [System]
 *     summary: Application metrics (Graphite/Grafana compatible)
 *     security: []
 */
export const getMetrics = (_req: Request, res: Response): void => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const uptimeSeconds = process.uptime();
  const avgResponseTime = totalRequests > 0 ? Math.round(totalResponseTimeMs / totalRequests) : 0;

  res.status(200).json({
    timestamp: new Date().toISOString(),
    app: {
      name: 'techfest-api',
      version: config.APP_VERSION,
      environment: config.NODE_ENV,
      uptime_seconds: Math.floor(uptimeSeconds),
      uptime_human: formatUptime(uptimeSeconds),
      start_time: new Date(startTime).toISOString(),
    },
    http: {
      total_requests: totalRequests,
      average_response_time_ms: avgResponseTime,
    },
    memory: {
      heap_used_mb: bytesToMB(memUsage.heapUsed),
      heap_total_mb: bytesToMB(memUsage.heapTotal),
      rss_mb: bytesToMB(memUsage.rss),
      external_mb: bytesToMB(memUsage.external),
    },
    cpu: {
      user_ms: Math.round(cpuUsage.user / 1000),
      system_ms: Math.round(cpuUsage.system / 1000),
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      node_version: process.version,
      hostname: os.hostname(),
      load_avg_1m: os.loadavg()[0].toFixed(2),
      total_memory_mb: bytesToMB(os.totalmem()),
      free_memory_mb: bytesToMB(os.freemem()),
      cpu_count: os.cpus().length,
    },
  });
};

/**
 * @openapi
 * /version:
 *   get:
 *     tags: [System]
 *     summary: Application version information
 *     security: []
 */
export const getVersion = (_req: Request, res: Response): void => {
  res.status(200).json({
    app: 'College Technical Symposium Event Management Platform',
    version: config.APP_VERSION,
    environment: config.NODE_ENV,
    node: process.version,
    build_time: new Date().toISOString(),
  });
};

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard statistics
 *     security:
 *       - bearerAuth: []
 */
export const getDashboardStats = async (_req: Request, res: Response, next: (err: unknown) => void): Promise<void> => {
  try {
    const [totalEvents, totalRegistrations, totalSpeakers, totalAnnouncements, recentRegistrations, eventsByCategory] =
      await Promise.all([
        prisma.event.count({ where: { isActive: true } }),
        prisma.registration.count(),
        prisma.speaker.count({ where: { isActive: true } }),
        prisma.announcement.count({ where: { isPublished: true } }),
        prisma.registration.findMany({
          take: 5,
          orderBy: { registeredAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            event: { select: { title: true } },
          },
        }),
        prisma.event.groupBy({
          by: ['category'],
          where: { isActive: true },
          _count: { _all: true },
        }),
      ]);

    res.json({
      success: true,
      message: 'Dashboard stats retrieved',
      data: {
        totalEvents,
        totalRegistrations,
        totalSpeakers,
        totalAnnouncements,
        recentRegistrations,
        eventsByCategory: eventsByCategory.map((e) => ({
          category: e.category,
          count: e._count._all,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};
