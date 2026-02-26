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
import { RoomsService } from '../rooms/rooms.service';
import { RoomStatus } from '../rooms/schema/room.schema';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<any>,
    private cloudinaryService: UploadService,
    private readonly roomsService: RoomsService,
  ) {}

  // =========================
  // CREATE
  // =========================
  async create(
    dto: CreateMaintenanceDto,
    userId: string,
    files?: Express.Multer.File[],
  ) {
    const room = await this.roomsService.findByTenant(userId);

    if (!room) {
      throw new BadRequestException('User has no assigned room');
    }

    let uploadedImages: { url: string; publicId: string }[] = [];

    if (files && files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          this.cloudinaryService.uploadImage(file, 'maintenance'),
        ),
      );

      uploadedImages = uploadResults.map((result: any) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const newMaintenance = new this.maintenanceModel({
      roomId: room._id,
      reportedBy: userId,
      title: dto.title,
      description: dto.description,
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

    const savedMaintenance = await newMaintenance.save();

    await this.roomsService.updateStatus(
      room._id.toString(),
      RoomStatus.MAINTENANCE,
    );

    return savedMaintenance;
  }

  // =========================
  // FIND ALL (Admin)
  // =========================
  async findAll() {
    return this.maintenanceModel
      .find()
      .populate('reportedBy', 'email profile')
      .populate('roomId', 'roomNumber floor')
      .sort({ createdAt: -1 })
      .exec();
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async updateStatus(id: string, status: string) {
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const maintenance = await this.maintenanceModel.findById(id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    maintenance.status = status;

    if (status === 'completed') {
      maintenance.completedAt = new Date();
    }

    maintenance.repairLogs.push({
      status,
      note: `เปลี่ยนสถานะเป็น ${status}`,
      updatedAt: new Date(),
    });

    const updatedMaintenance = await maintenance.save();

    if (status === 'completed') {
      await this.roomsService.updateStatus(
        maintenance.roomId.toString(),
        RoomStatus.AVAILABLE,
      );
    }

    return updatedMaintenance;
  }

  // =========================
  // ADD REPAIR LOG
  // =========================
  async addRepairLog(id: string, note: string, status?: string) {
    const maintenance = await this.maintenanceModel.findById(id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    maintenance.repairLogs.push({
      status: status || maintenance.status,
      note,
      updatedAt: new Date(),
    });

    if (status) {
      maintenance.status = status;

      if (status === 'completed') {
        maintenance.completedAt = new Date();
      }
    }

    const updatedMaintenance = await maintenance.save();

    // ✅ อัปเดตสถานะห้องถ้าเปลี่ยนเป็น completed (ซ่อมเสร็จ) แล้ว Status จะกลายเป็น occupied
    if (status === 'completed') {
      await this.roomsService.updateStatus(
        maintenance.roomId.toString(),
        RoomStatus.OCCUPIED,
      );
    }

    return updatedMaintenance;
  }

  // =========================
  // DELETE (Admin Only)
  // =========================
  async delete(id: string) {
    const maintenance = await this.maintenanceModel.findById(id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    // ✅ ลบรูปใน Cloudinary
    if (maintenance.images && maintenance.images.length > 0) {
      await Promise.all(
        maintenance.images.map((img: any) =>
          this.cloudinaryService.deleteImage(img.publicId),
        ),
      );
    }

    // ✅ อัปเดตสถานะห้องกลับ AVAILABLE
    await this.roomsService.updateStatus(
      maintenance.roomId.toString(),
      RoomStatus.AVAILABLE,
    );

    await this.maintenanceModel.findByIdAndDelete(id);

    return { message: 'Maintenance deleted successfully' };
  }
}
