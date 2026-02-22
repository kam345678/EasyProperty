import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    // โหลดค่าจากไฟล์ .env
    ConfigModule.forRoot({ isGlobal: true }),

    // เชื่อมต่อ MongoDB อ้างอิงจากเอกสารบทที่ 4
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // ลงทะเบียน Module แจ้งซ่อม
    MaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}