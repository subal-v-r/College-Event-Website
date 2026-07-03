import { Router } from 'express';
import { submitContact, getAllContactForms, markContactRead } from '../controllers/contact.controller';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, submitContact);
router.get('/', authenticate, requireAdmin, getAllContactForms);
router.patch('/:id/read', authenticate, requireAdmin, markContactRead);

export default router;
