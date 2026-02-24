import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class MeterItemDto {
  @IsNumber()
  previous: number;

  @IsNumber()
  current: number;

  @IsNumber()
  unitPrice: number;
}

class MetersDto {
  @ValidateNested()
  @Type(() => MeterItemDto)
  water: MeterItemDto;

  @ValidateNested()
  @Type(() => MeterItemDto)
  electric: MeterItemDto;
}

class AmountsDto {
  @IsNumber()
  rent: number;

  @IsNumber()
  serviceFee: number;

  @IsOptional()
  @IsNumber()
  waterTotal?: number;

  @IsOptional()
  @IsNumber()
  electricTotal?: number;

  @IsOptional()
  @IsNumber()
  grandTotal?: number;
}

class PaymentDto {
  @IsOptional()
  @IsIn(['pending', 'paid', 'overdue'])
  status?: 'pending' | 'paid' | 'overdue';

  @IsOptional()
  @IsString()
  slipUrl?: string;

  @IsOptional()
  paidAt?: Date;

  @IsOptional()
  @IsString()
  confirmedBy?: string;
}

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  contractId: string;

  @IsNotEmpty()
  @IsString()
  billingPeriod: string;

  @ValidateNested()
  @Type(() => MetersDto)
  meters: MetersDto;

  @ValidateNested()
  @Type(() => AmountsDto)
  amounts: AmountsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment?: PaymentDto;
}
