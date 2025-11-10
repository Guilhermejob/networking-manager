import { Router } from "express"
import { IndicationController } from "../controllers/indications.controller"

const router = Router()
const controller = new IndicationController()

router.post("/", controller.createIndication)
router.get("/", controller.getAllIndications)
router.get("/:id", controller.getIndicationById)
router.put("/:id/status", controller.updateStatus)
router.delete("/:id", controller.deleteIndication)

export default router
