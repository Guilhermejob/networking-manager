import { Request, Response } from "express"
import * as MemberService from "../services/members.service"
import { string } from "zod"


export async function create(req: Request, res: Response) {
    try {
        const { name, email, phone } = req.body
        if (!name || !email) {
            return res.status(400).json({ message: "Campos obrigatórios: name e email" })
        }

        const member = await MemberService.createMember({ name, email, phone })
        return res.status(201).json(member)

    } catch (error) {
        console.error("Erro ao criar membro", error)
        return res.status(500).json({ message: "Erro ao criar o cliente" })
    }
}

export async function list(req: Request, res: Response) {
    try {
        const members = await MemberService.listMembers()
        console.log(members, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        return res.status(200).json(members)

    } catch (error) {
        console.error("Erro a o listar clientes", error)
        return res.status(500).json({ message: "erro ao listar clientes" })
    }
}


export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params
        const member = await MemberService.getMemberById(id)
        return res.status(200).json(member)
    } catch (error) {
        console.error("Erro ao buscar cliente", error)
        return res.status(500).json({ message: "Erro ao encontro cliente" })
    }
}


export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { name, email, phone } = req.body

        const member = await MemberService.updateMember(String(id), { name, email, phone })
        return res.status(200).json(member)

    } catch (error) {
        console.error("Erro a o atualizar o cliente", error)
        return res.status(500).json({ message: "Erro a o atualziar o cliente" })
    }
}


export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params
        await MemberService.deleteMember(String(id))
        return res.status(204).send()
    } catch (error) {
        console.error("Erro ao deletar membro:", error)
        return res.status(500).json({ message: "Erro ao deletar membro" })
    }
}

