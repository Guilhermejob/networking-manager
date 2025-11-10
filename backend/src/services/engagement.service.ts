import { prisma } from '../prismaClient'
import { EngagementType } from '@prisma/client'

type EngagementCreate = {
  memberId: string
  type: EngagementType
  createdAt?: Date
  meetingId?: number
  // aceita `description`, será armazenado em `metadata`
  description?: string
}

export async function createEngagement(data: EngagementCreate) {
  // mapear description para metadata (campo Json no modelo Prisma)
  const createData: any = {
    memberId: data.memberId,
    type: data.type,
  }

  if (data.meetingId !== undefined) createData.meetingId = data.meetingId
  if (data.createdAt) createData.createdAt = data.createdAt
  if (data.description !== undefined) createData.metadata = { description: data.description }

  return prisma.engagement.create({ data: createData })
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
    // construir objeto de update sem campos desconhecidos
    const updateData: any = {}
    if (data.type !== undefined) updateData.type = data.type
    if ((data as any).points !== undefined) updateData.points = (data as any).points
    if (data.description !== undefined) updateData.metadata = { description: data.description }

    return prisma.engagement.update({
      where: { id },
      data: updateData,
    });
  }
