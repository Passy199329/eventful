import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Notifications (e2e)', () => {
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

    const email = `notif_${Date.now()}@example.com`;
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
        title: 'Test Event for Notifications',
        description: 'Event for notification testing',
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

  describe('POST /api/v1/notifications/reminder', () => {

    it('should set a reminder successfully with email channel', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, reminderDate: '2026-06-14T10:00:00.000Z', channel: 'email', message: 'Don\'t forget your event tomorrow!' })
        .expect(201);

      expect(res.body.notification).toHaveProperty('_id');
      expect(res.body.notification).toHaveProperty('eventId', eventId);
      expect(res.body.notification).toHaveProperty('channel', 'email');
    });

    it('should set a reminder successfully with sms channel', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, reminderDate: '2026-06-14T10:00:00.000Z', channel: 'sms', message: 'Your event is tomorrow!' })
        .expect(201);

      expect(res.body.notification).toHaveProperty('channel', 'sms');
    });

    it('should set a reminder successfully with push channel', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, reminderDate: '2026-06-14T10:00:00.000Z', channel: 'push', message: 'Your event is tomorrow!' })
        .expect(201);

      expect(res.body.notification).toHaveProperty('channel', 'push');
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .send({ eventId, reminderDate: '2026-06-14T10:00:00.000Z', channel: 'email', message: 'Test' })
        .expect(401);
    });

    it('should fail with invalid channel', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, reminderDate: '2026-06-14T10:00:00.000Z', channel: 'whatsapp', message: 'Test' })
        .expect(400);
    });

    it('should fail with missing eventId', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ reminderDate: '2026-06-14T10:00:00.000Z', channel: 'email', message: 'Test' })
        .expect(400);
    });

    it('should fail with missing message', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, reminderDate: '2026-06-14T10:00:00.000Z', channel: 'email' })
        .expect(400);
    });

    it('should fail with invalid date format', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/notifications/reminder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ eventId, reminderDate: 'not-a-date', channel: 'email', message: 'Test' })
        .expect(400);
    });
  });

  describe('GET /api/v1/notifications', () => {

    it('should return all notifications for current user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/notifications')
        .expect(401);
    });
  });
});