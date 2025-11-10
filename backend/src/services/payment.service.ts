import { prisma } from "../prismaClient";
import { PaymentStatus } from "@prisma/client";


  export async function create(data: { memberId: string; amount: number; dueDate: Date }) {
    return prisma.payment.create({ data });
  }

  export async function list() {
    return prisma.payment.findMany({
      include: { member: { select: { id: true, name: true, email: true } } },
      orderBy: { dueDate: "asc" },
    });
  }

  export async function updateStatus(id: string, status: PaymentStatus) {
    return prisma.payment.update({
      where: { id },
      data: { status, paidAt: status === PaymentStatus.PAID ? new Date() : null },
    });
  }

  export async function remove(id: string) {
    return prisma.payment.delete({ where: { id } });
  }
