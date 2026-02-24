import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  Get,
  Patch,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  // 1️⃣ Tenant แจ้งซ่อม (รองรับหลายรูป + Cloudinary)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5)) // อัปได้สูงสุด 5 รูป
  async create(
    @Body() dto: CreateMaintenanceDto,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB ต่อรูป
        ],
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.maintenanceService.create(dto, files);
  }

  // 2️⃣ Admin ดูรายการแจ้งซ่อมทั้งหมด
  @Get()
  async findAll() {
    return this.maintenanceService.findAll();
  }

  // 3️⃣ Admin เปลี่ยนสถานะ (pending → in_progress → completed)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.maintenanceService.updateStatus(id, status);
  }

  // 4️⃣ Admin บันทึกประวัติการซ่อม
  @Patch(':id/repair-log')
  async addRepairLog(
    @Param('id') id: string,
    @Body('note') note: string,
    @Body('status') status: string,
  ) {
    return this.maintenanceService.addRepairLog(id, note, status);
  }
}
