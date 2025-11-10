import { prisma } from '../prismaClient'
import { IndicationStatus } from "@prisma/client";

interface CreateIndicationDTO {
  title: string;
  description?: string;
  fromId: string;
  toId: string;
}

export class IndicationService {
  async createIndication(data: CreateIndicationDTO) {
    const { title, description, fromId, toId } = data;

    if (fromId === toId) {
      throw new Error("Um membro não pode indicar a si mesmo.");
    }

    const [from, to] = await Promise.all([
      prisma.member.findUnique({ where: { id: fromId } }),
      prisma.member.findUnique({ where: { id: toId } }),
    ]);

    if (!from || !to) {
      throw new Error("Membro remetente ou destinatário não encontrado.");
    }

    return prisma.indication.create({
      data: {
        title,
        description,
        fromId,
        toId,
      },
    });
  }

  async getAllIndications() {
    return prisma.indication.findMany({
      include: {
        from: { select: { id: true, name: true, email: true } },
        to: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getIndicationById(id: string) {
    return prisma.indication.findUnique({
      where: { id },
      include: {
        from: { select: { id: true, name: true, email: true } },
        to: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async updateStatus(id: string, status: IndicationStatus) {
    const validStatuses = Object.values(IndicationStatus);
    if (!validStatuses.includes(status)) {
      throw new Error("Status inválido.");
    }

    return prisma.indication.update({
      where: { id },
      data: { status },
    });
  }

  async deleteIndication(id: string) {
    return prisma.indication.delete({ where: { id } });
  }
}
