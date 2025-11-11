import request from "supertest";
import { PrismaClient } from '@prisma/client';
import app from "../../src/app";
import { cleanDatabase } from "../utils/cleanDatabase";

const prisma = new PrismaClient();

describe('Members Controller', () => {
  beforeEach(async () => {
    await  cleanDatabase()
  });

  
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a member', async () => {
    const res = await request(app).post('/members').send({
      name: 'Carlos',
      email: 'carlos@example.com',
      phone: '1199998888',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should list all members', async () => {
    await prisma.member.create({
      data: { name: 'Ana', email: 'ana@example.com' },
    });

    const res = await request(app).get('/members');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a member', async () => {
    const member = await prisma.member.create({
      data: { name: 'Teste', email: 'teste@a.com' },
    });

    const res = await request(app)
      .put(`/members/${member.id}`)
      .send({ name: 'Novo Nome' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Novo Nome');
  });
});
