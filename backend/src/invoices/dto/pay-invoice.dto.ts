import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class PayInvoiceDto {
  @IsNotEmpty()
  @IsString()
  slipUrl: string;

  @IsNotEmpty()
  @IsDateString()
  paidAt: string;
}
