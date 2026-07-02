import { Router } from 'express';
import {
  getAllScheduleItems, createScheduleItem, updateScheduleItem, deleteScheduleItem,
} from '../controllers/schedules.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllScheduleItems);
router.post('/', authenticate, requireAdmin, createScheduleItem);
router.put('/:id', authenticate, requireAdmin, updateScheduleItem);
router.delete('/:id', authenticate, requireAdmin, deleteScheduleItem);

export default router;
