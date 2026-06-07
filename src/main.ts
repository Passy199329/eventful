import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { GlobalExceptionFilter }
from './shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );

  await app.listen(process.env.PORT || 5000);

  console.log(
    `Server running on port ${process.env.PORT || 5000}`,
  );
}

bootstrap();