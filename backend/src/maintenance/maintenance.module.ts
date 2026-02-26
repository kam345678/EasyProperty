import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { Maintenance, MaintenanceSchema } from './entities/maintenance.entity';
import { UploadModule } from 'src/upload/upload.module';
import { RoomsModule } from 'src/rooms/rooms.module'; // 🔥 เพิ่มบรรทัดนี้

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Maintenance.name, schema: MaintenanceSchema },
    ]),
    UploadModule,
    RoomsModule, // 🔥 สำคัญมาก
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
