import { 
  Controller, Post, Body, UploadedFile, UseInterceptors, 
  ParseFilePipe, MaxFileSizeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Controller('maintenance') // นี่คือสาเหตุที่ทำให้เรียก /maintenance ได้
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateMaintenanceDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ],
      }),
    ) file?: any,
  ) {
    return this.maintenanceService.create(dto, file);
  }
}