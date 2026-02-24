import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async create(dto: CreateInvoiceDto) {
    // 1. คำนวณค่าน้ำ: (ใหม่ - เก่า) * ราคาต่อหน่วย
    const waterUsed = dto.meters.water.current - dto.meters.water.previous;
    const waterTotal = waterUsed * dto.meters.water.unitPrice;

    // 2. คำนวณค่าไฟ: (ใหม่ - เก่า) * ราคาต่อหน่วย
    const electricUsed = dto.meters.electric.current - dto.meters.electric.previous;
    const electricTotal = electricUsed * dto.meters.electric.unitPrice;

    // 3. คำนวณยอดรวมทั้งสิ้น
    const grandTotal = dto.amounts.rent + waterTotal + electricTotal + dto.amounts.serviceFee;

    // 4. บันทึกลง Database
    const newInvoice = new this.invoiceModel({
      ...dto,
      amounts: {
        rent: dto.amounts.rent,
        waterTotal: waterTotal,
        electricTotal: electricTotal,
        serviceFee: dto.amounts.serviceFee,
        grandTotal: grandTotal,
      },
      payment: {
        status: 'pending', // เริ่มต้นเป็นค้างชำระเสมอ
      },
    });

    return await newInvoice.save();
  }

  async findAll() {
    return await this.invoiceModel.find().exec();
  }
}