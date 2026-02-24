// src/maintenance/dto/create-maintenance.dto.ts
import { IsNotEmpty, IsString } from 'class-validator'; // [cite: 63, 207]

export class CreateMaintenanceDto {
  @IsNotEmpty({ message: 'กรุณากรอกหัวข้อปัญหา' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'กรุณากรอกรายละเอียด' })
  @IsString()
  description: string;
}
