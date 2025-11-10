import { Router } from 'express'
import { createCheckin, listCheckinsByMember, listAllCheckins } from '../controllers/checkins.controller'
import { adminAuth } from '../middlewares/adminAuth'

const router = Router()

router.post('/', createCheckin) // Membro registra presença
router.get('/member/:memberId', listCheckinsByMember) // Check-ins do membro
router.get('/all', adminAuth, listAllCheckins) // Apenas admin vê todos

export default router
