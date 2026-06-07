import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sharing (e2e)', () => {
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

    const email = `sharing_${Date.now()}@example.com`;
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
        title: 'Test Event for Sharing',
        description: 'Event for sharing testing',
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

  describe('GET /api/v1/sharing/:eventId/link', () => {

    it('should generate a share link successfully', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/sharing/${eventId}/link`)
        .expect(200);

      expect(res.body).toHaveProperty('shareLink');
      expect(res.body.shareLink).toContain(eventId);
    });

    it('should not require auth token', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/sharing/${eventId}/link`)
        .expect(200);
    });
  });

  describe('GET /api/v1/sharing/:eventId/social', () => {

    it('should share to twitter successfully', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/sharing/${eventId}/social?platform=twitter`)
        .expect(200);

      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('twitter');
    });

    it('should share to facebook successfully', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/sharing/${eventId}/social?platform=facebook`)
        .expect(200);

      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('facebook');
    });

    it('should share to whatsapp successfully', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/sharing/${eventId}/social?platform=whatsapp`)
        .expect(200);

      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('wa.me');
    });

    it('should not require auth token', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/sharing/${eventId}/social?platform=twitter`)
        .expect(200);
    });
  });
});