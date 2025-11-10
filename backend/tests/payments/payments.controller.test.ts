import request from "supertest";
import { PrismaClient } from '@prisma/client';
import app from "../../src/app";

const prisma = new PrismaClient();

describe('Payments Controller', () => {
  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.member.deleteMany();
  });

  it('should create a payment record', async () => {
    const member = await prisma.member.create({
      data: { name: 'Diego', email: 'diego@pay.com' },
    });

    const res = await request(app).post('/payments').send({
      memberId: member.id,
      amount: 150.0,
      dueDate: new Date().toISOString(),
      status: 'PENDING',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should list payments', async () => {
    const res = await request(app).get('/payments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update payment status', async () => {
    const member = await prisma.member.create({ data: { name: 'Leo', email: 'leo@pay.com' } });
    const payment = await prisma.payment.create({
      data: { memberId: member.id, amount: 200, status: 'PENDING', dueDate: new Date()},
    });

    const res = await request(app)
      .put(`/payments/${payment.id}`)
      .send({ status: 'PAID' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('PAID');
  });
});
