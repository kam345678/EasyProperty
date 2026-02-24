// src/maintenance/maintenance.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Maintenance,
  MaintenanceDocument,
} from './entities/maintenance.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  // สร้าง Logger เพื่อช่วยดู Log ใน Terminal ได้ง่ายขึ้น
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<MaintenanceDocument>,
  ) {}

  async create(dto: CreateMaintenanceDto, file?: any) {
    try {
      // 1. Debug: เช็คว่าข้อมูล DTO และไฟล์วิ่งเข้ามาที่ Service หรือยัง
      console.log('--- Debug Start ---');
      console.log('Received DTO:', dto);
      console.log('Received File:', file ? file.filename : 'No file');

      let imageUrl = '';
      if (file) {
        imageUrl = `maintenance/${file.filename}`;
      }

      // 2. สร้าง Instance ของ Model
      // แยกค่าออกมาเพื่อความชัดเจน ป้องกันปัญหาเรื่องชื่อฟิลด์ใน DTO ไม่ตรงกับ Entity
      const newRecord = new this.maintenanceModel({
        title: dto.title,
        description: dto.description,
        imageUrl: imageUrl,
        status: 'OPEN', // กำหนดค่าเริ่มต้นตามที่คุณต้องการ
      });

      console.log('Model instance created, attempting to save to MongoDB...');

      // 3. บันทึกลงฐานข้อมูล
      const savedData = await newRecord.save();

      console.log('Successfully saved to DB:', savedData._id);
      console.log('--- Debug End ---');

      return savedData;
    } catch (error) {
      // 4. พ่น Error จริงๆ ออกมาที่ Terminal
      this.logger.error('===== DATABASE SAVE ERROR =====');
      this.logger.error(error.message); // บอกสาเหตุ เช่น ต่อ DB ไม่ติด หรือ Schema ผิด
      this.logger.error(error.stack); // บอกบรรทัดที่เกิดปัญหา
      this.logger.error('================================');

      // ส่ง Error กลับไปหา Postman/Frontend ให้เห็นข้อความที่ชัดเจนขึ้น
      throw new InternalServerErrorException(`DB Error: ${error.message}`);
    }
  }
}
