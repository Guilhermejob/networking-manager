import { Router } from "express"

import {
    createIntention,
    completeRegistration,
    verifyInvitationToken,
    listIntentions
} from "../controllers/admission.controller"

const router = Router()



router.post("/intentions", createIntention)
router.get("/intentions", listIntentions)
router.get("/invitations/:token", verifyInvitationToken)
router.post("/invitations/:token/complete", completeRegistration)

export default router