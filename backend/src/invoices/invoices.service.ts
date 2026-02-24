import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { Contract } from '../contracts/schemas/contract.schema';
import { Room } from '../rooms/schema/room.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  // Admin creates monthly invoice
  async create(dto: CreateInvoiceDto) {
    const contract = await this.contractModel
      .findById(dto.contractId)
      .populate('roomId tenantId');

    if (!contract) throw new NotFoundException('Contract not found');

    const room = contract.roomId as any;

    const waterPrevious = room.lastMeterReading.water;
    const electricPrevious = room.lastMeterReading.electric;

    const waterUsed = dto.meters.water.current - waterPrevious;
    const electricUsed = dto.meters.electric.current - electricPrevious;

    if (waterUsed < 0 || electricUsed < 0) {
      throw new BadRequestException(
        'Meter value cannot be lower than previous',
      );
    }
    const WATER_PRICE = 10;
    const ELECTRIC_PRICE = 8;
    const waterTotal = waterUsed * WATER_PRICE;
    const electricTotal = electricUsed * ELECTRIC_PRICE;

    const grandTotal =
      dto.amounts.rent + dto.amounts.serviceFee + waterTotal + electricTotal;

    const invoice = new this.invoiceModel({
      contractId: contract._id,
      roomId: room._id,
      tenantId: contract.tenantId,
      billingPeriod: dto.billingPeriod,
      meters: {
        water: {
          previous: waterPrevious,
          current: dto.meters.water.current,
          unitPrice: WATER_PRICE,
        },
        electric: {
          previous: electricPrevious,
          current: dto.meters.electric.current,
          unitPrice: ELECTRIC_PRICE,
        },
      },
      amounts: {
        rent: dto.amounts.rent,
        serviceFee: dto.amounts.serviceFee,
        waterTotal,
        electricTotal,
        grandTotal,
      },
      payment: { status: 'pending' },
    });

    // update last meter reading
    room.lastMeterReading.water = dto.meters.water.current;
    room.lastMeterReading.electric = dto.meters.electric.current;
    room.lastMeterReading.updatedAt = new Date();

    await room.save();

    return invoice.save();
  }

  // Tenant uploads slip
  async pay(invoiceId: string, dto: PayInvoiceDto) {
    const invoice = await this.invoiceModel.findById(invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');

    invoice.payment = {
      status: 'paid_pending_review',
      slipUrl: dto.slipUrl,
      slipId: dto.slipId,
      paidAt: new Date(dto.paidAt),
    };

    return invoice.save();
  }

  // Admin confirms or rejects payment
  async confirm(
    invoiceId: string,
    adminId: string,
    status: 'paid' | 'rejected',
  ) {
    const invoice = await this.invoiceModel.findById(invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');

    invoice.payment.status = status;
    invoice.payment.confirmedBy = new Types.ObjectId(adminId);

    return invoice.save();
  }

  async findAll() {
    return this.invoiceModel
      .find()
      .populate('roomId tenantId contractId')
      .exec();
  }

  async findOne(id: string) {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('roomId tenantId contractId payment.confirmedBy')
      .exec();

    if (!invoice) throw new NotFoundException('Invoice not found');

    return invoice;
  }

  async findByTenant(tenantId: string) {
    return this.invoiceModel
      .find({ tenantId })
      .populate('roomId contractId')
      .exec();
  }
}
