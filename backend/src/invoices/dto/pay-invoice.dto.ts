import { IsOptional, IsString, IsDateString } from 'class-validator';

export class PayInvoiceDto {
  @IsOptional()
  @IsString()
  slipUrl?: string;

  @IsOptional()
  @IsString()
  slipId?: string;

  @IsDateString()
  paidAt: string;
}
