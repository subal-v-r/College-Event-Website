import { Router } from 'express';
import {
  registerForEvent, getMyRegistrations, getAllRegistrations, cancelRegistration,
} from '../controllers/registrations.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, registerForEvent);
router.get('/my', authenticate, getMyRegistrations);
router.get('/', authenticate, requireAdmin, getAllRegistrations);
router.patch('/:id/cancel', authenticate, cancelRegistration);

export default router;
