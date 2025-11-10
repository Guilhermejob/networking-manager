import { Request, Response } from 'express'
import {
  createEngagement,
  listEngagements,
  getEngagementById,
  deleteEngagement,
  update,
} from '../services/engagement.service'

export async function createEngagementController(req: Request, res: Response) {
  try {
    const engagement = await createEngagement(req.body)
    res.status(201).json(engagement)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Erro ao criar engagement' })
  }
}


export async function listEngagementsController(req: Request, res: Response) {
  try {
    const engagements = await listEngagements()
    res.status(200).json(engagements)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao listar engagements' })
  }
}


export async function updateEngagamentController(req: Request, res: Response) {
  try {
    const engagement = await update(req.params.id, req.body)
    res.json(engagement)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export async function getEngagementByIdController(req: Request, res: Response) {
  try {
    const engagement = await getEngagementById(req.params.id)
    if (!engagement) {
      return res.status(404).json({ message: 'Engagement não encontrado' })
    }
    res.status(200).json(engagement)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar engagement' })
  }
}


export async function deleteEngagementController(req: Request, res: Response) {
  try {
    await deleteEngagement(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao deletar engagement' })
  }
}
