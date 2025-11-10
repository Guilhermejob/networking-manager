import { Request, Response } from "express"
import * as AdmissionService  from "../services/admission.service"


export async function createIntention(req: Request, res:Response){
    try{
        
        const {name, email, phone, message} = req.body
        if (!name || !email) return res.status(400).json({ message: "Campos obrigatórios: name e email" })

        const intention = await AdmissionService.createIntention({name, email, phone, message})
        return res.status(201).json(intention)
    }catch(err:any){
        console.error("Erro ao criar intenção", err)
        return res.status(500).json({message:err.message})
    }
}

export async function listIntentions(req:Request, res:Response) {
    
    try{
        const intentions = await AdmissionService.listIntentions()
        return res.json(intentions)
    }catch(err:any){
        console.error("Erro ao listar intenções", err)

        return res.status(500).json({message:err.message})
    }
}

export async function approveIntention(req:Request, res:Response) {
    
    try{

        const intentionId = Number(req.params.intentionId)
        const result = await AdmissionService.approveIntention(intentionId, {expireInDays:7})
        return res.json(result)
        
    }catch(err:any){
        console.error("Error ao aprovar intenção", err)
        return res.status(500).json({message:err.message})
    }
}


export async function verifyInvitationToken(req: Request, res: Response) {
    
    try{
        const { token } = req.params
        const result = await AdmissionService.verifyInvitationToken(token)
        return res.json(result)
    }catch(err:any){
        console.error("Erro ao verificar convite", err)
        return res.status(400).json({message: err.message })
    }
}

export async function completeRegistration(req: Request, res: Response) {
    
    try{
        const { token } = req.params
        const {name, email, phone} = req.body

        const member = await AdmissionService.completeRegistration(token, {name, email, phone})

        return res.status(201).json(member)
   
    }catch(err:any){
        console.error("Erro ao completar registro", err)
        return res.status(400).json({message:err.message})
    }

}