// src/maintenance/entities/maintenance.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // [cite: 59, 112]
import { HydratedDocument } from 'mongoose';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema({ timestamps: true })
export class Maintenance {
  @Prop({ type: String, required: true })
  roomId: string;

  @Prop({ type: String, required: true })
  reportedBy: string;

  @Prop({ type: String, default: null })
  assignedTo?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    default: [],
  })
  images: {
    url: string;
    publicId: string;
  }[];

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: string;

  @Prop({
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: [
      {
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed'],
          required: true,
        },
        note: { type: String, required: true },
        updatedAt: { type: Date, required: true },
      },
    ],
    default: [],
  })
  repairLogs: {
    status: string;
    note: string;
    updatedAt: Date;
  }[];
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
