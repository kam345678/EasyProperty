// src/contracts/contracts.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract, ContractSchema } from './schemas/contract.schema';

// 🔥 ต้องนำเข้า Room และ RoomSchema มาจากไฟล์ Schema ของ Room
// ตัวอย่าง Path: ../rooms/schemas/room.schema (ปรับตามจริงในเครื่องคุณ)
import { Room, RoomSchema } from '../rooms/schema/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      // 1. ลงทะเบียน Contract Model
      {
        name: Contract.name,
        schema: ContractSchema,
      },

      // 2. 🔥 ลงทะเบียน Room Model
      // เพื่อให้ ContractsService สามารถใช้ @InjectModel(Room.name) ได้
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],

  // 🔥 Export ContractsService เผื่อกรณีที่คุณต้องการให้ UsersService
  // หรือ AdminService เรียกใช้ฟังก์ชันสร้างสัญญาจาก Module อื่น
  exports: [ContractsService],
})
export class ContractsModule {}
