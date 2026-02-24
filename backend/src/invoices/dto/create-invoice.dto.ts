import { IsNotEmpty, IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  contractId: string;

  @IsNotEmpty()
  @IsString()
  billingPeriod: string;

  @IsObject()
  meters: {
    water: { previous: number; current: number; unitPrice: number };
    electric: { previous: number; current: number; unitPrice: number };
  };

  @IsObject()
  amounts: {
    rent: number;
    serviceFee: number;
    // หมายเหตุ: ยอดรวมอื่นๆ เราจะให้ Backend คำนวณให้เพื่อความแม่นยำ
  };
}