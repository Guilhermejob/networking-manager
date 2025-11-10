import { prisma } from '../prismaClient'
import { nanoid } from "nanoid"
import { sendInvitationEmail } from "../utils/emailSimulator"
import { send } from 'process';


type IntentionCreate = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function createIntention(data: IntentionCreate) {
  return prisma.intention.create({ data })
}

export async function listIntentions() {
  return prisma.intention.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function approveIntention(intentionId: number, opts: { expireInDays?: number }) {

  const intention = await prisma.intention.findUnique({ where: { id: intentionId } })

  if (!intention) throw new Error('Intention not found')
  if (intention.status == 'APPROVED') throw new Error('Intention already approved')

  await prisma.intention.update({
    where: { id: intentionId },
    data: { status: 'APPROVED', processedAt: new Date(), processedBy: 'system' },
  })

  const token = nanoid(32);

  const expiresAt = opts.expireInDays ? new Date(Date.now() + opts.expireInDays * 24 * 3600 * 1000) : null

  const invitation = await prisma.invitation.create({
    data: { token, intentionId: intentionId, expiresAt: expiresAt ?? undefined }
  })

  sendInvitationEmail(intention.email, { token: invitation.token, expiresAt })

  return { intention, invitation }
}

export async function verifyInvitationToken(token: string) {

  const inv = await prisma.invitation.findUnique({ where: { token }, include: { Intention: true, member: true } })

  if (!inv) throw new Error('Invalid token')

  if (inv.used) throw new Error('Token already used')

  if (inv.expiresAt && inv.expiresAt < new Date()) throw new Error('Token expired')

  return inv

}

export async function completeRegistration(token: string, data: { name: string; email: string; phone?: string }) {

  const inv = await prisma.invitation.findUnique({ where: { token } })

  if (!inv) throw new Error('Invalid token')
  if (inv.used) throw new Error('Token already used')
  if (inv.expiresAt && inv.expiresAt < new Date()) throw new Error('Token expired')

  const member = await prisma.member.create({
    data: { name: data.name, email: data.email, phone: data.phone }
  })

  await prisma.invitation.update({ where: { id: inv.id }, data: { used: true } })

  return member
}