import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'invoices' })
export class Invoice extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  contractId: Types.ObjectId; // อ้างอิงจากสัญญาเช่า

  @Prop({ required: true })
  billingPeriod: string; // เช่น "2026-02"

  // รายละเอียดมิเตอร์
  @Prop({
    type: {
      water: {
        previous: Number,
        current: Number,
        unitPrice: Number,
      },
      electric: {
        previous: Number,
        current: Number,
        unitPrice: Number,
      },
    },
    _id: false,
  })
  meters: {
    water: { previous: number; current: number; unitPrice: number };
    electric: { previous: number; current: number; unitPrice: number };
  };

  // สรุปยอดเงิน
  @Prop({
    type: {
      rent: Number,
      waterTotal: Number,
      electricTotal: Number,
      serviceFee: Number,
      grandTotal: Number,
    },
    _id: false,
  })
  amounts: {
    rent: number;
    waterTotal: number;
    electricTotal: number;
    serviceFee: number;
    grandTotal: number;
  };

  // ข้อมูลการชำระเงิน
  @Prop({
    type: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending',
      },
      slipUrl: String,
      paidAt: Date,
      confirmedBy: { type: Types.ObjectId },
    },
    _id: false,
  })
  payment: {
    status: string;
    slipUrl?: string;
    paidAt?: Date;
    confirmedBy?: Types.ObjectId;
  };
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
