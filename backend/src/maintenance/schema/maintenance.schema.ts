import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Room } from 'src/rooms/schema/room.schema';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Maintenance {
  // 👤 ผู้แจ้งซ่อม (tenant)
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  reportedBy: Types.ObjectId;

  // 🚪 ห้องที่แจ้ง
  @Prop({
    type: Types.ObjectId,
    ref: Room.name,
    required: true,
  })
  roomId: Types.ObjectId;

  // 👷 ผู้รับงาน (admin) — optional
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: null,
  })
  assignedTo?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: string;

  @Prop({
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDING,
  })
  status: MaintenanceStatus;

  @Prop([
    {
      url: String,
      publicId: String,
    },
  ])
  images?: { url: string; publicId: string }[];

  @Prop([
    {
      status: String,
      note: String,
      updatedAt: Date,
    },
  ])
  repairLogs?: {
    status: string;
    note: string;
    updatedAt: Date;
  }[];

  //(Mongo จะลบเองหลัง 395 วัน)
  @Prop({
    type: Date,
    expires: 60 * 60 * 24 * 395, // 395 วัน ≈ 13 เดือน
  })
  completedAt?: Date;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
