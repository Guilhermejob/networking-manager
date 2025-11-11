import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanDatabase() {
  await prisma.indication.deleteMany();
  await prisma.engagement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.member.deleteMany();
}
