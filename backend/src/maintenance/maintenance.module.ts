import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { Maintenance, MaintenanceSchema } from './entities/maintenance.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    // เชื่อมต่อ MongoDB Schema
    MongooseModule.forFeature([
      { name: Maintenance.name, schema: MaintenanceSchema },
    ]),
    UploadModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
