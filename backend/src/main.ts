// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ แก้ไขส่วน CORS ให้สมบูรณ์
  app.enableCors({
    origin: 'http://localhost:3001', // พอร์ต Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization', // 🔥 ต้องมี Authorization ตรงนี้
  });

  // ใช้พอร์ตจาก env หรือ 3000
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server is running on: http://localhost:3000/api/v1`);
}
bootstrap();