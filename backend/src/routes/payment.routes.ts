// src/routes/payment.routes.ts
import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const controller = new PaymentController();

router.post("/", controller.create);
router.get("/", controller.list);
router.put("/:id/status", controller.updateStatus);
router.delete("/:id", controller.remove);

export default router;
