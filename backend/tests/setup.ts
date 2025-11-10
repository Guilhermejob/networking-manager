import { PrismaClient } from '@prisma/client';
import app from "../src/app"
import supertest from 'supertest';

const prisma = new PrismaClient();
const request = supertest(app);

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { app, prisma, request };
