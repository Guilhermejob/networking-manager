import request from "supertest";
import { PrismaClient } from '@prisma/client';
import app from "../../src/app";


const prisma = new PrismaClient();

describe('Admission Controller', () => {
  beforeAll(() => {
    process.env.ADMIN_KEY = process.env.ADMIN_KEY || 'test_admin_key'
  })

  beforeEach(async () => {
    await prisma.invitation.deleteMany();
    await prisma.intention.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new intention', async () => {
    const res = await request(app).post('/admissions/intentions').send({
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '1199999999',
      message: 'Quero participar do grupo',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should list all intentions', async () => {
    const res = await request(app).get('/admissions/intentions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should approve an intention', async () => {
    const created = await prisma.intention.create({
      data: { name: 'Teste', email: 'teste@a.com' },
    });

    const res = await request(app)
      .post(`/admin/intentions/${created.id}/approve`)
      .set('x-admin-key', process.env.ADMIN_KEY || 'test_admin_key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('invitation');

    const updated = await prisma.intention.findUnique({ where: { id: created.id } });
    expect(updated?.status).toBe('APPROVED');
  });
});
