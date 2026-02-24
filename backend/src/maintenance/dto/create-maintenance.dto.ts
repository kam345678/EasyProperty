// src/maintenance/dto/create-maintenance.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsArray,
  IsIn,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class RepairLogDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'])
  status: string;

  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;
}

export class CreateMaintenanceDto {
  @IsNotEmpty()
  @IsMongoId()
  roomId: string;

  @IsNotEmpty()
  @IsMongoId()
  reportedBy: string;

  @IsOptional() // ตอน tenant สร้างงานยังไม่ต้อง assign ช่าง
  @IsMongoId()
  assignedTo?: string;

  @IsNotEmpty({ message: 'กรุณากรอกหัวข้อปัญหา' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'กรุณากรอกรายละเอียด' })
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepairLogDto)
  repairLogs?: RepairLogDto[];
}
