import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { ConfirmInvoiceDto } from './dto/confirm-invoice.dto';
import { UploadService } from '../upload/upload.service';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly uploadService: UploadService,
  ) {}

  // Admin: create monthly invoice
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  // Tenant: upload payment slip
  @Patch(':id/pay')
  @UseInterceptors(FileInterceptor('file'))
  async pay(
    @Param('id') invoiceId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PayInvoiceDto,
  ) {
    if (!file) {
      throw new Error('Slip file is required');
    }

    const uploadResult: any = await this.uploadService.uploadImage(
      file,
      'invoice-slips',
    );

    dto.slipUrl = uploadResult.secure_url;
    dto.slipId = uploadResult.public_id;

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Get('tenant/:tenantId')
  async findByTenant(@Param('tenantId') tenantId: string) {
    return this.invoicesService.findByTenant(tenantId);
  }

  // Admin: list all invoices
  @Get()
  async findAll() {
    return this.invoicesService.findAll();
  }
}
