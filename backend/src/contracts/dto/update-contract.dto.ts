// src/contracts/dto/update-contract.dto.ts

import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsMongoId,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FinancialsDto {
  @IsOptional()
  @IsNumber()
  deposit?: number;

  @IsOptional()
  @IsNumber()
  advancePayment?: number;
}

export class UpdateContractDto {
  @IsOptional()
  @IsMongoId()
  roomId?: string;

  @IsOptional()
  @IsMongoId()
  tenantId?: string;

  @IsOptional()
  @IsEnum(['daily', 'monthly'])
  type?: 'daily' | 'monthly';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: 'active' | 'completed' | 'cancelled';

  @IsOptional()
  @ValidateNested()
  @Type(() => FinancialsDto)
  financials?: FinancialsDto;
}
