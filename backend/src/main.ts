import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: 'http://localhost:3000' })
  await app.listen(3001)
  console.log('Backend listening on http://localhost:3001')
}

bootstrap()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // http://localhost:3000/api/v1/
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001', // พอร์ต Next.js
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
