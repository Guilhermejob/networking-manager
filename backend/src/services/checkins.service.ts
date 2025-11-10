import { prisma } from '../prismaClient'

export async function createCheckin(memberId: string, meetingId?: number) {
  return prisma.checkin.create({
    data: { memberId, meetingId },
  })
}

export async function listCheckinsByMember(memberId: string) {
  return prisma.checkin.findMany({
    where: { memberId },
    orderBy: { date: 'desc' },
  })
}

export async function listAllCheckins() {
  return prisma.checkin.findMany({
    orderBy: { date: 'desc' },
    include: { member: true },
  })
}
