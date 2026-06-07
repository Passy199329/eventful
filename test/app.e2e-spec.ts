import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 404 for unknown routes', () => {
    return request(app.getHttpServer())
      .get('/unknown-route')
      .expect(404);
  });

  it('should have auth routes available', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({})
      .expect(400);
  });

  it('should have events routes available', () => {
    return request(app.getHttpServer())
      .get('/api/v1/events')
      .expect(200);
  });
});