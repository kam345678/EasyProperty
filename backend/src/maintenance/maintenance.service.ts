import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Maintenance } from './entities/maintenance.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<Maintenance>,
    private cloudinaryService: UploadService,
  ) {}

  // 1️⃣ Tenant สร้างรายการแจ้งซ่อม (หลายรูป + Cloudinary)
  async create(dto: CreateMaintenanceDto, files?: Express.Multer.File[]) {
    let uploadedImages: { url: string; publicId: string }[] = [];

    if (files && files.length > 0) {
      const uploadResults = (await Promise.all(
        files.map((file) =>
          this.cloudinaryService.uploadImage(file, 'maintenance'),
        ),
      )) as any[];

      uploadedImages = uploadResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const newMaintenance = new this.maintenanceModel({
      ...dto,
      images: uploadedImages,
      status: 'pending',
      priority: dto.priority || 'medium',
      repairLogs: [
        {
          status: 'pending',
          note: 'แจ้งซ่อมเข้าระบบ',
          updatedAt: new Date(),
        },
      ],
    });

    return newMaintenance.save();
  }

  // 2️⃣ Admin ดูทั้งหมด
  async findAll() {
    return this.maintenanceModel.find().sort({ createdAt: -1 }).exec();
  }

  // 3️⃣ Admin เปลี่ยนสถานะ
  async updateStatus(id: string, status: string) {
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const maintenance = await this.maintenanceModel.findById(id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    maintenance.status = status;

    maintenance.repairLogs.push({
      status,
      note: `เปลี่ยนสถานะเป็น ${status}`,
      updatedAt: new Date(),
    });

    return maintenance.save();
  }

  // 4️⃣ Admin เพิ่ม repair log
  async addRepairLog(id: string, note: string, status: string) {
    const maintenance = await this.maintenanceModel.findById(id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    maintenance.repairLogs.push({
      status,
      note,
      updatedAt: new Date(),
    });

    if (status) {
      maintenance.status = status;
    }

    return maintenance.save();
  }
}
