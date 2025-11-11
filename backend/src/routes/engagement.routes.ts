import { Router } from 'express'
import {
  createEngagementController,
  listEngagementsController,
  getEngagementByIdController,
  deleteEngagementController,
  updateEngagamentController
} from '../controllers/engagement.controller'

const router = Router()

router.post('/', createEngagementController)
router.get('/', listEngagementsController)
router.get('/:id', getEngagementByIdController)
router.put("/:id", updateEngagamentController);
router.delete('/:id', deleteEngagementController)

export default router
