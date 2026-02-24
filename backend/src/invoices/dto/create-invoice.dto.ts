import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MeterCurrentDto {
  @IsNumber()
  current: number;
}

class MetersDto {
  @ValidateNested()
  @Type(() => MeterCurrentDto)
  water: MeterCurrentDto;

  @ValidateNested()
  @Type(() => MeterCurrentDto)
  electric: MeterCurrentDto;
}

class AmountsDto {
  @IsNumber()
  rent: number;

  @IsNumber()
  serviceFee: number;
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
}
