import { Router } from "express"

import {
    createIntention,
    listIntentions,
    approveIntention,
    completeRegistration,
    verifyInvitationToken
} from "../controllers/admission.controller"

const router = Router()



router.post("/intentions", createIntention)
router.get("/intentions", listIntentions)
router.post("/intentions/:intentionId/approve", approveIntention)
router.get("/invitations/:token", verifyInvitationToken)
router.post("/invitations/:token/complete", completeRegistration)

export default router