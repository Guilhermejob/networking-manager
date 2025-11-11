import { Request, Response, NextFunction } from 'express';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const adminKey = process.env.ADMIN_KEY;
  const headerKey = req.headers['x-admin-key'];

  if (!adminKey || headerKey !== adminKey) {
    return res.status(403).json({ message: 'Acesso negado: chave inválida' });
  }

  next();
}
