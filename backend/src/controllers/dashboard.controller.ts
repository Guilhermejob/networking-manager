import { Request, Response } from 'express'
import { getDashboardData } from '../services/dashboard.service'

export async function getDashboardController(req: Request, res: Response) {
  try {
    const data = await getDashboardData()
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao carregar dados do dashboard' })
  }
}
