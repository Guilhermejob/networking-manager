import { Router } from 'express'
import { getDashboardController } from '../controllers/dashboard.controller'

const router = Router()

router.get('/', getDashboardController)

export default router
