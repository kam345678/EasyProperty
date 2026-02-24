// src/contracts/schemas/contract.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true })
export class Contract {
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tenantId: Types.ObjectId;

  @Prop({ enum: ['daily', 'monthly'], required: true })
  type: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ enum: ['active', 'completed', 'cancelled'], default: 'active' })
  status: string;

  @Prop({
    type: {
      deposit: { type: Number, required: true },
      advancePayment: { type: Number, required: true },
    },
    required: true,
  })
  financials: {
    deposit: number;
    advancePayment: number;
  };
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
