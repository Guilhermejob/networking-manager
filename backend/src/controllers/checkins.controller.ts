import { Request, Response } from 'express'
import * as CheckinService from '../services/checkins.service'

export async function createCheckin(req: Request, res: Response) {
  try {
    const { memberId, meetingId } = req.body
    if (!memberId) {
      return res.status(400).json({ message: 'O campo memberId é obrigatório' })
    }

    const checkin = await CheckinService.createCheckin(memberId, meetingId)
    return res.status(201).json(checkin)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao registrar check-in' })
  }
}

export async function listCheckinsByMember(req: Request, res: Response) {
  try {
    const { memberId } = req.params
    const checkins = await CheckinService.listCheckinsByMember(memberId)
    return res.json(checkins)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao listar check-ins do membro' })
  }
}

export async function listAllCheckins(req: Request, res: Response) {
  try {
    const checkins = await CheckinService.listAllCheckins()
    return res.json(checkins)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao listar todos os check-ins' })
  }
}
