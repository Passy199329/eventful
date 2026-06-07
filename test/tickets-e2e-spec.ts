import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tickets (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let eventId: string;
  let ticketId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    const email = `tickets_${Date.now()}@example.com`;
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
        title: 'Test Event for Tickets',
        description: 'Event for ticket testing',
        location: 'Lagos',
        startDate: '2026-06-15T18:00:00.000Z',
        endDate: '2026-06-15T23:00:00.000Z',
        price: 5000,
      });

    eventId = eventRes.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/tickets/purchase', () => {

    it('should purchase a ticket successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/tickets/purchase')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, ticketType: 'VIP', quantity: 2 })
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('ticketType', 'VIP');
      expect(res.body).toHaveProperty('quantity', 2);

      ticketId = res.body._id;
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/tickets/purchase')
        .send({ eventId, ticketType: 'VIP', quantity: 1 })
        .expect(401);
    });

    it('should fail with missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/tickets/purchase')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketType: 'VIP' })
        .expect(400);
    });

    it('should fail with invalid quantity type', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/tickets/purchase')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, ticketType: 'VIP', quantity: 'two' })
        .expect(400);
    });
  });

  describe('GET /api/v1/tickets/my-tickets', () => {

    it('should return all tickets for current user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tickets/my-tickets')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tickets/my-tickets')
        .expect(401);
    });
  });

  describe('GET /api/v1/tickets/:id', () => {

    it('should return ticket by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('_id', ticketId);
      expect(res.body).toHaveProperty('ticketType', 'VIP');
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/tickets/${ticketId}`)
        .expect(401);
    });

    it('should return 404 for non-existent ticket', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tickets/000000000000000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});