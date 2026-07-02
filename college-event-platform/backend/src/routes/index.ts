import { Router } from 'express';
import { getDashboardStats } from '../controllers/health.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import authRoutes from './auth.routes';
import eventsRoutes from './events.routes';
import speakersRoutes from './speakers.routes';
import schedulesRoutes from './schedules.routes';
import registrationsRoutes from './registrations.routes';
import announcementsRoutes from './announcements.routes';
import contactRoutes from './contact.routes';

const router = Router();

// ── Feature routes (mounted at /api/v1) ─────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/speakers', speakersRoutes);
router.use('/schedules', schedulesRoutes);
router.use('/registrations', registrationsRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/contact', contactRoutes);

// ── Admin dashboard stats ────────────────────────────────────────────────────
router.get('/dashboard/stats', authenticate, requireAdmin, getDashboardStats);

export default router;
