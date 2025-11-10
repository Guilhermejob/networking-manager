import { Request, Response } from 'express'
import * as NoticeService from '../services/notices.service'

export async function createNotice(req: Request, res: Response) {
  try {
    const { title, content, author } = req.body
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Campos obrigatórios: title, content, author' })
    }

    const notice = await NoticeService.createNotice({ title, content, author })
    return res.status(201).json(notice)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao criar comunicado' })
  }
}

export async function listNotices(req: Request, res: Response) {
  try {
    const notices = await NoticeService.listNotices()
    return res.json(notices)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao listar comunicados' })
  }
}

export async function getNoticeById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const notice = await NoticeService.getNoticeById(String(id))
    return res.json(notice)
  } catch (error) {
    console.error(error)
    return res.status(404).json({ message: 'Comunicado não encontrado' })
  }
}
