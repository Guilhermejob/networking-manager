import {prisma} from '../prismaClient'

type NoticeCreate = {
    title: string
    content: string
    author: string
}

export async function createNotice (data:NoticeCreate){
    return prisma.notice.create({data})
}

export async function listNotices(){
    return prisma.notice.findMany({orderBy: {createdAt:'desc'}})
}

export async function getNoticeById(id:string) {

    const notice = await prisma.notice.findUnique({where:{id}})

    if(!notice) throw new Error('Comunicado não encontrado')
    return notice
}