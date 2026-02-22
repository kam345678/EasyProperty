import { Module } from '@nestjs/common'
import { BookingModule } from './booking/booking.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [PrismaModule, BookingModule],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { RoomsModule } from './rooms/rooms.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ตั้งค่า rate limiting โดยใช้ ThrottlerModule
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    UploadModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
