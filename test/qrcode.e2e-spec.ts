import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('QR Code (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let ticketId: string;

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
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    accessToken = loginRes.body.accessToken;

    // Create event
    const eventRes = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Event for QR Code',
        description: 'Event for QR code testing',
        location: 'Lagos',
        startDate: '2026-06-15T18:00:00.000Z',
        endDate: '2026-06-15T23:00:00.000Z',
        price: 5000,
      });

    const eventId = eventRes.body._id;

    // Purchase ticket
    const ticketRes = await request(app.getHttpServer())
      .post('/api/v1/tickets/purchase')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        eventId,
        ticketType: 'VIP',
        quantity: 1,
      });

    ticketId = ticketRes.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  // ── GENERATE QR CODE ──
  describe('POST /api/v1/qrcode/:ticketId', () => {

    it('should generate QR code successfully', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/qrcode/${ticketId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(res.body).toHaveProperty('qrCode');
      expect(res.body).toHaveProperty('ticketId', ticketId);
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/qrcode/${ticketId}`)
        .expect(401);
    });
  });

  // ── VERIFY QR CODE ──
  describe('PATCH /api/v1/qrcode/verify', () => {

    it('should verify QR code successfully', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/qrcode/verify')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketId })
        .expect(200);

      expect(res.body).toHaveProperty('valid', true);
      expect(res.body).toHaveProperty('message', 'Ticket verified successfully');
      expect(res.body).toHaveProperty('ticket');
    });

    it('should return already used for scanned ticket', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/qrcode/verify')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketId })
        .expect(200);

      expect(res.body).toHaveProperty('valid', false);
      expect(res.body).toHaveProperty('message', 'Ticket already used');
    });

    it('should fail without auth token', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/qrcode/verify')
        .send({ ticketId })
        .expect(401);
    });

    it('should fail with missing ticketId', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/qrcode/verify')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });

    it('should return 404 for non-existent ticket', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/qrcode/verify')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ticketId: '000000000000000000000000' })
        .expect(404);
    });
  });
});