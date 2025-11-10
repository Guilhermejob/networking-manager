import { prisma } from '../prismaClient'

export async function getDashboardData() {
  const [totalMembers, totalEngagements, totalIndications] = await Promise.all([
    prisma.member.count(),
    prisma.engagement.count(),
    prisma.indication.count(),
  ])

  // Média de engajamentos por membro
  const averageEngagementPerMember =
    totalMembers > 0 ? totalEngagements / totalMembers : 0

  // Últimos 5 engajamentos
  const recentEngagements = await prisma.engagement.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { member: true },
  })

  // Top 5 membros mais ativos (por número de engajamentos)
  const mostActiveMembers = await prisma.engagement.groupBy({
    by: ['memberId'],
    _count: { memberId: true },
    orderBy: { _count: { memberId: 'desc' } },
    take: 5,
  })

  const membersWithNames = await Promise.all(
    mostActiveMembers.map(async (item) => {
      const member = await prisma.member.findUnique({
        where: { id: item.memberId },
        select: { name: true },
      })
      return {
        memberId: item.memberId,
        name: member?.name,
        engagementCount: item._count.memberId,
      }
    })
  )

  return {
    totalMembers,
    totalEngagements,
    totalIndications,
    averageEngagementPerMember,
    recentEngagements,
    mostActiveMembers: membersWithNames,
  }
}
