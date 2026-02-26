import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { DashboardAdminService } from './dashboard_admin.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('dashboard-admin')
export class DashboardAdminController {
  constructor(private readonly dashboardService: DashboardAdminService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Get('summary')
  async getSummary() {
    try {
      return await this.dashboardService.getStats();
    } catch {
      throw new InternalServerErrorException(
        'ไม่สามารถดึงข้อมูล Dashboard ได้',
      );
    }
  }
}
