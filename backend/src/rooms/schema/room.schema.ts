// backend/src/rooms/schema/room.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
}

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  roomNumber: string;

  @Prop({ required: true })
  floor: number;

  @Prop({ type: String, enum: Object.values(RoomStatus), default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @Prop()
  roomType: string;

  // ✅ เปลี่ยนเป็น amenities ตามข้อมูลใน DB ของคุณ
  @Prop([String])
  amenities: string[];

  // ✅ เปลี่ยนเป็น prices ตามข้อมูลใน DB ของคุณ
  @Prop({ default: 0 })
  prices: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  currentTenant: Types.ObjectId;

  // ✅ เพิ่มฟิลด์มิเตอร์ตามโครงสร้างใน MongoDB
  @Prop({ type: Object })
  lastMeterReading: {
    water: number;
    electric: number;
  };
}

export const RoomSchema = SchemaFactory.createForClass(Room);