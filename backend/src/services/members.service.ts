import { prisma } from "../prismaClient";

type MemberCreate = {
    name:string
    email:string
    phone?:string
}

export async function createMember(data:MemberCreate) {
    return prisma.member.create({data})
}

export async function listMembers() {
  return prisma.member.findMany({
    orderBy: { joinedAt: "desc" },
  });
}

export async function getMemberById(id:string){
    const member = await prisma.member.findUnique({where:{id}})
    if (!member) throw new Error("O cliente não foi encontrado")
    return member
}


export async function updateMember(
  id: string,
  data: Partial<MemberCreate>
) {
  const member = await prisma.member.update({
    where: { id },
    data,
  });
  return member;
}

export async function deleteMember(id: string) {
  return prisma.member.delete({ where: { id } });
}