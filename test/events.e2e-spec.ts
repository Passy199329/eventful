import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let eventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.setGlobalPrefix('api/v1');
    await app.init();

    // Login to get token
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  // ── CREATE EVENT ──
  describe('POST /api/v1/events', () => {

    it('should create an event successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Lagos Music Festival',
          description: 'A night of amazing music',
          location: 'Eko Hotel, Lagos',
          startDate: '2026-06-15T18:00:00.000Z',
          endDate: '2026-06-15T23:00:00.000Z',
          price: 5000,
        })
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'Lagos Music Festival');
      expect(res.body).toHaveProperty('price', 5000);

      eventId = res.body._id;
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/events')
        .send({
          title: 'Test Event',
          description: 'Test',
          location: 'Lagos',
          startDate: '2026-06-15T18:00:00.000Z',
          endDate: '2026-06-15T23:00:00.000Z',
          price: 5000,
        })
        .expect(401);
    });

    it('should fail with missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Incomplete Event',
        })
        .expect(400);
    });

    it('should fail with invalid date format', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Event',
          description: 'Test',
          location: 'Lagos',
          startDate: 'not-a-date',
          endDate: '2026-06-15T23:00:00.000Z',
          price: 5000,
        })
        .expect(400);
    });
  });

  // ── GET ALL EVENTS ──
  describe('GET /api/v1/events', () => {

    it('should return all events', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/events')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should not require auth token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/events')
        .expect(200);
    });
  });

  // ── GET EVENT BY ID ──
  describe('GET /api/v1/events/:id', () => {

    it('should return event by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/events/${eventId}`)
        .expect(200);

      expect(res.body).toHaveProperty('_id', eventId);
      expect(res.body).toHaveProperty('title', 'Lagos Music Festival');
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/events/000000000000000000000000')
        .expect(404);
    });
  });

  // ── UPDATE EVENT ──
  describe('PATCH /api/v1/events/:id', () => {

    it('should update event successfully', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Lagos Music Festival',
          price: 8000,
        })
        .expect(200);

      expect(res.body).toHaveProperty('title', 'Updated Lagos Music Festival');
      expect(res.body).toHaveProperty('price', 8000);
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/events/${eventId}`)
        .send({ title: 'Unauthorized Update' })
        .expect(401);
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/events/000000000000000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  // ── DELETE EVENT ──
  describe('DELETE /api/v1/events/:id', () => {

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/events/${eventId}`)
        .expect(401);
    });

    it('should delete event successfully', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/v1/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Event deleted successfully');
    });

    it('should return 404 for already deleted event', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});