// src/maintenance/entities/maintenance.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // [cite: 59, 112]
import { HydratedDocument } from 'mongoose';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema({ timestamps: true })
export class Maintenance {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl: string;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);