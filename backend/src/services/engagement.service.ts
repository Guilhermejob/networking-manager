import { prisma } from '../prismaClient'
import { EngagementType } from '@prisma/client'

type EngagementCreate = {
  memberId: string
  type: EngagementType
  createdAt?: Date
  meetingId?: number
  notes?: string
}

export async function createEngagement(data: EngagementCreate) {
  return prisma.engagement.create({ data })
}

export async function listEngagements() {
  return prisma.engagement.findMany({
    include: { member: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getEngagementById(id: string) {
  return prisma.engagement.findUnique({
    where: { id },
    include: { member: true },
  })
}

export async function deleteEngagement(id: string) {
  return prisma.engagement.delete({ where: { id } })
}

export async function update(id: string, data: Partial<{
    type: EngagementType;
    description?: string;
    points?: number;
  }>) {
    return prisma.engagement.update({
      where: { id },
      data,
    });
  }
