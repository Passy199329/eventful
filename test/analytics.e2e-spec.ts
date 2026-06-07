import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Analytics (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let eventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    const email = `analytics_${Date.now()}@example.com`;
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
        title: 'Test Event for Analytics',
        description: 'Event for analytics testing',
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

  describe('POST /api/v1/analytics', () => {

    it('should create analytics successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/analytics')
        .send({ eventId, totalViews: 0, totalTicketsSold: 0, totalRevenue: 0, totalAttendees: 0 })
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('eventId', eventId);
    });
  });

  describe('GET /api/v1/analytics', () => {

    it('should return all analytics', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/analytics')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/v1/analytics/:eventId', () => {

    it('should return analytics for a specific event', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/analytics/${eventId}`)
        .expect(200);

      expect(res.body).toHaveProperty('eventId', eventId);
    });

    it('should return 404 for non-existent event analytics', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/analytics/000000000000000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/v1/analytics/:eventId', () => {

    it('should update analytics successfully', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/analytics/${eventId}`)
        .send({ totalViews: 100, totalTicketsSold: 50, totalRevenue: 250000, totalAttendees: 50 })
        .expect(200);

      expect(res.body).toHaveProperty('totalViews', 100);
      expect(res.body).toHaveProperty('totalTicketsSold', 50);
    });

    it('should update only specified fields', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/analytics/${eventId}`)
        .send({ totalViews: 200 })
        .expect(200);

      expect(res.body).toHaveProperty('totalViews', 200);
    });

    it('should return 404 for non-existent event analytics', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/analytics/000000000000000000000000')
        .send({ totalViews: 100 })
        .expect(404);
    });
  });
});