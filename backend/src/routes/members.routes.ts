import { Router } from "express"
import {
    create,
    getById,
    list,
    remove,
    update
} from "../controllers/members.controller"

const router = Router()

router.post("/", create)
router.get("/", list)
router.get("/:id", getById)
router.put("/:id", update)
router.delete("/:id", remove)

export default router