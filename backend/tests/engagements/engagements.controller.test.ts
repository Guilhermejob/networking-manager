import request from "supertest";
import { PrismaClient,EngagementType } from '@prisma/client';
import app from "../../src/app";



const prisma = new PrismaClient();

describe('Engagement Controller', () => {
  beforeEach(async () => {
    await prisma.engagement.deleteMany();
    await prisma.member.deleteMany();
  });

  it('should create a check-in engagement', async () => {
    const member = await prisma.member.create({ data: { name: 'Pedro', email: 'pedro@teste.com' } });

    const res = await request(app).post('/engagements').send({
      memberId: member.id,
      type: 'CHECKIN',
      description: 'Presença semanal',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should edit an engagement', async () => {
    const member = await prisma.member.create({ data: { name: 'João', email: 'joao@x.com' } });

    const created = await prisma.engagement.create({
      data: { memberId: member.id, type: 'INDICATION_SENT' },
    });

    const res = await request(app)
      .put(`/engagements/${created.id}`)
      .send({ description: 'Atualizado' });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('Atualizado');
  });

  it('should delete an engagement', async () => {
    const member = await prisma.member.create({ data: { name: 'Maria', email: 'm@m.com' } });
    const engagement = await prisma.engagement.create({
      data: { memberId: member.id, type: 'CHECKIN' },
    });

    const res = await request(app).delete(`/engagements/${engagement.id}`);
    expect(res.statusCode).toBe(204);
  });
});
