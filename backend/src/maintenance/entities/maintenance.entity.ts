import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Room } from 'src/rooms/schema/room.schema';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema({ timestamps: true })
export class Maintenance {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  reportedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Room.name,
    required: true,
  })
  roomId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: null,
  })
  assignedTo?: Types.ObjectId;

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
