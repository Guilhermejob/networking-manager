import { Request, Response } from "express";
import * as PaymentService from "../services/payment.service"

export class PaymentController {
  async create(req: Request, res: Response) {
    try {
      const { memberId, amount, dueDate } = req.body;
      const payment = await PaymentService.create({
        memberId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
      });
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const payments = await PaymentService.list();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const payment = await PaymentService.updateStatus(id, status);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PaymentService.remove(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
