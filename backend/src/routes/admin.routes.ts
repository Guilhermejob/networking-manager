import { Router, Request, Response } from 'express'
import { adminAuth } from '../middlewares/adminAuth'
import { listIntentions, approveIntention, rejectIntention } from '../controllers/admission.controller'


const router = Router()

router.post('/login', (req: Request, res: Response) => {
  const { key } = req.body
  const adminKey = process.env.ADMIN_KEY
  console.log(adminKey, '.env')
  console.log(key, 'req.body')

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
router.post('/intentions/:intentionId/reject', adminAuth, rejectIntention)

export default router