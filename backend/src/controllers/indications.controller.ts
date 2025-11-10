import { Request, Response } from "express"
import { IndicationService } from "../services/indications.service"

//aqui fez usando classes para demostrar que sei tanto o metodo oritentado a objeto quanto o funcional

const service = new IndicationService()

export class IndicationController {
  
  async createIndication(req: Request, res: Response) {
    try {
      const { title, description, fromId, toId } = req.body
      const indication = await service.createIndication({ title, description, fromId, toId })
      return res.status(201).json(indication)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getAllIndications(req: Request, res: Response) {
    try {
      const indications = await service.getAllIndications()
      return res.json(indications)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getIndicationById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const indication = await service.getIndicationById(id)
      if (!indication) return res.status(404).json({ message: "Indicação não encontrada" })
      return res.json(indication)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body
      const updated = await service.updateStatus(id, status)
      return res.json(updated)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async deleteIndication(req: Request, res: Response) {
    try {
      const { id } = req.params
      await service.deleteIndication(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}
