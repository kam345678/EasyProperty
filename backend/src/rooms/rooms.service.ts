import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument, RoomStatus } from './schema/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  // ✅ สร้างห้อง
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // เช็คเลขห้องซ้ำ
    const existingRoom = await this.roomModel.findOne({
      roomNumber: createRoomDto.roomNumber,
    });

    if (existingRoom) {
      throw new ConflictException('Room number already exists');
    }

    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  // ✅ ดูห้องทั้งหมด (filter ตาม status ได้)
  async findAll(status?: RoomStatus): Promise<Room[]> {
    const filter = status ? { status } : {};

    return this.roomModel
      .find(filter)
      .populate('currentTenant')
      .sort({ floor: 1, roomNumber: 1 })
      .exec();
  }

  // ✅ ดูรายละเอียดห้องตาม ID
  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel
      .findById(id)
      .populate('currentTenant')
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  // ✅ อัปเดตสถานะห้อง
  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}
