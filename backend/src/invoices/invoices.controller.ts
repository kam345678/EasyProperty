import { Controller, Post, Get, Patch, Body, Param, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { ConfirmInvoiceDto } from './dto/confirm-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // Admin: create monthly invoice
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  // Tenant: upload payment slip
  @Patch(':id/pay')
  async pay(@Param('id') invoiceId: string, @Body() dto: PayInvoiceDto) {
    return this.invoicesService.pay(invoiceId, dto);
  }

  // Admin: confirm or reject payment
  @Patch(':id/confirm')
  async confirm(
    @Param('id') invoiceId: string,
    @Body() dto: ConfirmInvoiceDto,
    @Req() req: any,
  ) {
    // adminId should come from JWT in real usage
    const adminId = req.user?.sub || 'SYSTEM_ADMIN';
    return this.invoicesService.confirm(invoiceId, adminId, dto.status);
  }

  // Admin: list all invoices
  @Get()
  async findAll() {
    return this.invoicesService.findAll();
  }
}
