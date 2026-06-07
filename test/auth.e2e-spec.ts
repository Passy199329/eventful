import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  const testEmail = `testuser_${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {

    it('should register a new user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: 'password123', firstName: 'Test', lastName: 'User' })
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Registration successful');
      expect(res.body.user).toHaveProperty('email', testEmail);
    });

    it('should fail if user already exists', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: 'password123', firstName: 'Test', lastName: 'User' })
        .expect(400);

      expect(res.body.message).toBe('User already exists');
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: 'password123', firstName: 'Test', lastName: 'User' })
        .expect(400);
    });

    it('should fail with missing password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: `another_${Date.now()}@example.com`, firstName: 'Test', lastName: 'User' })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {

    it('should login successfully and return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'password123' })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should fail with wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' })
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' })
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should fail with missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {

    it('should return new tokens with valid refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should fail with invalid refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid_token' })
        .expect(401);

      expect(res.body.message).toBe('Invalid refresh token');
    });

    it('should fail with missing refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400);
    });
  });
});