// src/contracts/dto/create-contract.dto.ts

import {
  IsMongoId,
  IsEnum,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FinancialsDto {
  @IsNumber()
  deposit: number;

  @IsNumber()
  advancePayment: number;
}

export class CreateContractDto {
  @IsMongoId()
  roomId: string;

  @IsMongoId()
  tenantId: string;

  @IsEnum(['daily', 'monthly'])
  type: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['active', 'completed', 'cancelled'])
  status: string;

  @ValidateNested()
  @Type(() => FinancialsDto)
  financials: FinancialsDto;

  @IsDateString()
  createdAt: string;
}
