import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Payments (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let ticketId: string;
  let paymentReference: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    const email = `payments_${Date.now()}@example.com`;
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password: 'password123', firstName: 'Test', lastName: 'User' });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'password123' });

    accessToken = loginRes.body.accessToken;

    const eventRes = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Event for Payments',
        description: 'Event for payment testing',
        location: 'Lagos',
        startDate: '2026-06-15T18:00:00.000Z',
        endDate: '2026-06-15T23:00:00.000Z',
        price: 5000,
      });

    const ticketRes = await request(app.getHttpServer())
      .post('/api/v1/tickets/purchase')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ eventId: eventRes.body._id, ticketType: 'Regular', quantity: 1 });

    ticketId = ticketRes.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/payments/initialize', () => {

    it('should initialize payment successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketId, email: 'testuser@example.com', amount: 5000 })
        .expect(201);

      expect(res.body).toHaveProperty('authorization_url');
      expect(res.body).toHaveProperty('reference');

      paymentReference = res.body.reference;
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/payments/initialize')
        .send({ ticketId, email: 'testuser@example.com', amount: 5000 })
        .expect(401);
    });

    it('should fail with missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'testuser@example.com' })
        .expect(400);
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketId, email: 'not-an-email', amount: 5000 })
        .expect(400);
    });

    it('should fail with invalid amount type', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketId, email: 'testuser@example.com', amount: 'five-thousand' })
        .expect(400);
    });
  });

  describe('GET /api/v1/payments/verify/:reference', () => {

    it('should verify payment with valid reference', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/payments/verify/${paymentReference}`)
        .expect(200);

      expect(res.body).toHaveProperty('reference', paymentReference);
    });

    it('should return 404 for non-existent reference', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/payments/verify/nonexistentreference')
        .expect(404);
    });
  });

  describe('POST /api/v1/payments/webhook', () => {

    it('should handle charge.success webhook', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/payments/webhook')
        .send({ event: 'charge.success', data: { reference: paymentReference, status: 'success' } })
        .expect(201);

      expect(res.body).toHaveProperty('received', true);
    });

    it('should handle unknown webhook events gracefully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/payments/webhook')
        .send({ event: 'unknown.event', data: { reference: paymentReference } })
        .expect(201);

      expect(res.body).toHaveProperty('received', true);
    });
  });
});