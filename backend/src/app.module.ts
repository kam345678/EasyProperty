// backend/src/app.module.ts

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
import { MaintenanceModule } from './maintenance/maintenance.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ContractsModule } from './contracts/contracts.module';

// 1. เพิ่มบรรทัด Import ตรงนี้ (เช็คชื่อโฟลเดอร์ให้ตรงกับของเพื่อนนะ dashboard_Admin หรือ dashboard_admin)
import { DashboardAdminModule } from './dashboard_Admin/dashboard_admin.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

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
    MaintenanceModule,
    InvoicesModule,
    ContractsModule,
    
    // 2. เพิ่มชื่อ Module เข้าไปในอาร์เรย์ imports ตรงนี้ ✅
    DashboardAdminModule, 
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}