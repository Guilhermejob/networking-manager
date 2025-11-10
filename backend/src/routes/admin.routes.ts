import { Router, Request, Response } from 'express'
import { adminAuth } from '../middlewares/adminAuth'
import { listIntentions, approveIntention } from '../controllers/admission.controller'

const router = Router()

router.post('/login', (req: Request, res: Response) => {
  const { key } = req.body
  const adminKey = process.env.ADMIN_KEY

  if (!adminKey) {
    return res.status(500).json({ message: 'ADMIN_KEY não configurada no ambiente' })
  }

  if (key !== adminKey) {
    return res.status(403).json({ message: 'Chave inválida' })
  }

  return res.status(200).json({ message: 'Acesso concedido', isAdmin: true })
})

router.get('/intentions', adminAuth, listIntentions)
router.post('/intentions/:intentionId/approve', adminAuth, approveIntention)

export default router