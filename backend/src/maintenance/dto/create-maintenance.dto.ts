import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateMaintenanceDto {
  @IsNotEmpty({ message: 'กรุณากรอกหัวข้อปัญหา' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'กรุณากรอกรายละเอียด' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
