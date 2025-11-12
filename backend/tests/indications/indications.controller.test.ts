import request from "supertest";
import { PrismaClient } from '@prisma/client';
import app from "../../src/app";
import { cleanDatabase } from "../utils/cleanDatabase";

const prisma = new PrismaClient();

describe('Indications Controller', () => {
  beforeEach(async () => {
    await cleanDatabase()
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create an indication', async () => {
    const from = await prisma.member.create({ data: { name: 'A', email: 'a@a.com', phone: '99999999' } });
    const to = await prisma.member.create({ data: { name: 'B', email: 'b@b.com', phone: '99999999' } });

    const res = await request(app).post('/indications').send({
      title: 'Nova Parceria',
      description: 'Contato de negócio',
      fromId: from.id,
      toId: to.id,
    });


    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should list indications', async () => {
    const res = await request(app).get('/indications');
    expect(res.statusCode).toBe(200);
  });
});
