import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardAdminController } from './dashboard_admin.controller';
import { DashboardAdminService } from './dashboard_admin.service';
// Import Schema ของคนอื่นมาใช้
import { RoomSchema } from '../rooms/schema/room.schema';
import { InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { MaintenanceSchema } from '../maintenance/schema/maintenance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema },
      { name: 'Invoice', schema: InvoiceSchema },
      { name: 'Maintenance', schema: MaintenanceSchema },
    ]),
  ],
  controllers: [DashboardAdminController],
  providers: [DashboardAdminService],
})
export class DashboardAdminModule {}
