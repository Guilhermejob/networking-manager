import { Router } from 'express';
import { adminAuth } from '../middlewares/adminAuth';
import { listIntentions, approveIntention } from '../controllers/admission.controller';

const router = Router();

router.get('/intentions', adminAuth, listIntentions);
router.post('/intentions/:intentionId/approve', adminAuth, approveIntention);

export default router;
