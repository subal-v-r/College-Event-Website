import { Router } from 'express';
import {
  getAllSpeakers, getSpeakerById, createSpeaker, updateSpeaker, deleteSpeaker,
} from '../controllers/speakers.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllSpeakers);
router.get('/:id', getSpeakerById);
router.post('/', authenticate, requireAdmin, createSpeaker);
router.put('/:id', authenticate, requireAdmin, updateSpeaker);
router.delete('/:id', authenticate, requireAdmin, deleteSpeaker);

export default router;
