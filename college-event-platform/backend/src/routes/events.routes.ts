import { Router } from 'express';
import {
  getAllEvents, getEventById, createEvent, updateEvent, deleteEvent,
} from '../controllers/events.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', authenticate, requireAdmin, createEvent);
router.put('/:id', authenticate, requireAdmin, updateEvent);
router.delete('/:id', authenticate, requireAdmin, deleteEvent);

export default router;
