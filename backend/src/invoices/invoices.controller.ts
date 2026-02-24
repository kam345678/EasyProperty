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
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('invoices')
@UseGuards(AccessTokenGuard, RolesGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly uploadService: UploadService,
  ) {}

  // Admin: create monthly invoice
  @Post()
  @Roles('admin')
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  // Tenant: upload payment slip
  @Patch(':id/pay')
  @Roles('tenant')
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
  @Roles('admin')
  async confirm(
    @Param('id') invoiceId: string,
    @Body() dto: ConfirmInvoiceDto,
    @Req() req: any,
  ) {
    const user = req.user as JwtPayload;

    if (!user?.sub) {
      throw new Error('Admin ID missing from token');
    }

    return this.invoicesService.confirm(invoiceId, user.sub, dto.status);
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
