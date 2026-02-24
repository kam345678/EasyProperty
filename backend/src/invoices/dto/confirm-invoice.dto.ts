import { IsIn } from 'class-validator';

export class ConfirmInvoiceDto {
  @IsIn(['paid', 'rejected'])
  status: 'paid' | 'rejected';
}
