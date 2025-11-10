import { Router } from 'express'
import { createNotice, listNotices, getNoticeById } from '../controllers/notices.controller'
import { adminAuth } from '../middlewares/adminAuth'

const router = Router()

router.get('/', listNotices)
router.get('/:id', getNoticeById)
router.post('/', adminAuth, createNotice)

export default router
