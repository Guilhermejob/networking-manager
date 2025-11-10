import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import admissionRoutes from "./routes/admission.routes";
import membersRoutes from "./routes/members.routes"
import indicationsRoutes from './routes/indications.routes'
import adminRoutes from './routes/admin.routes';
import noticesRoutes from './routes/notices.routes'
import engagementRoutes from './routes/engagement.routes'
import dashboardRoutes from './routes/dashboard.routes'
import paymentRoutes from "./routes/payment.routes";

const app = express();

app.use(cors());
app.use(express.json());

//Rotas principais
app.use("/admissions", admissionRoutes)
app.use("/members", membersRoutes)
app.use("/indications", indicationsRoutes)
app.use("/notices", noticesRoutes)
app.use("/admin", adminRoutes);
app.use('/engagements', engagementRoutes)
app.use('/dashboard', dashboardRoutes)
app.use("/payments", paymentRoutes);

//Rota base (teste rápido)
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API do sistema de admissões está rodando!");
});

//Middleware 404 - Rota não encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.originalUrl,
  });
});

//Middleware global de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro capturado:", err);

  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor";

  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
