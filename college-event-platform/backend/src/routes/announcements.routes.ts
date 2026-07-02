import { Router } from 'express';
import {
  getAllAnnouncements, getAllAnnouncementsAdmin, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from '../controllers/announcements.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllAnnouncements);
router.get('/admin/all', authenticate, requireAdmin, getAllAnnouncementsAdmin);
router.post('/', authenticate, requireAdmin, createAnnouncement);
router.put('/:id', authenticate, requireAdmin, updateAnnouncement);
router.delete('/:id', authenticate, requireAdmin, deleteAnnouncement);

export default router;
