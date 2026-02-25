import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Patch,
  Param,
  UploadedFiles,
  UseGuards,
  Req,
  Delete, // ✅ เพิ่มตรงนี้
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  // =========================
  // TENANT CREATE
  // =========================
  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() dto: CreateMaintenanceDto,
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.maintenanceService.create(dto, req.user.sub, files);
  }

  // =========================
  // ADMIN FIND ALL
  // =========================
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.maintenanceService.findAll();
  }

  // =========================
  // ADMIN UPDATE STATUS
  // =========================
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.maintenanceService.updateStatus(id, status);
  }

  // =========================
  // ADMIN ADD REPAIR LOG
  // =========================
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/repair-log')
  async addRepairLog(
    @Param('id') id: string,
    @Body('note') note: string,
    @Body('status') status?: string,
  ) {
    return this.maintenanceService.addRepairLog(id, note, status);
  }

  // =========================
  // ADMIN DELETE
  // =========================
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.maintenanceService.delete(id);
  }
}
