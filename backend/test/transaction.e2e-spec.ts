/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Transactions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/transactions/process (POST) - fail on insufficient balance', async () => {
    const res = await request(app.getHttpServer())
      .post('/transactions/process')
      .send({ transactions: [{ personId: 1, ammount: 99999999 }] });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('statusCode', 400);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('error', 'Bad Request');
  });
});
