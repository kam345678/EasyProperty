import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

export enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
}

@Schema({ _id: false })
export class LastMeterReading {
  @Prop({ required: true, min: 0, default: 0 })
  water: number;

  @Prop({ required: true, min: 0, default: 0 })
  electric: number;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  roomNumber: string;

  @Prop({ required: true, min: 1 })
  floor: number;

  @Prop({ required: true, enum: RoomType })
  roomType: RoomType;

  @Prop({ required: true, min: 0 })
  prices: number;

  @Prop({ required: true, enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  currentTenant: Types.ObjectId | null;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: LastMeterReading, default: {} })
  lastMeterReading: LastMeterReading;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
