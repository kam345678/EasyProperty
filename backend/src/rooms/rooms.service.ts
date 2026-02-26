// backend/src/rooms/rooms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument, RoomStatus } from './schema/room.schema';
import { Contract, ContractDocument } from '../contracts/schemas/contract.schema';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Contract.name) private readonly contractModel: Model<ContractDocument>,
  ) {}

  // ✅ ฟังก์ชันดึงข้อมูลทั้งหมด (แมปราคา 4500 และข้อมูลสัญญาให้ตรงกับ DB)
  async findAll(status?: RoomStatus): Promise<any[]> {
    const filter = status ? { status } : {};
    const rooms = await this.roomModel
      .find(filter)
      .populate('currentTenant', 'profile email role')
      .sort({ floor: 1, roomNumber: 1 })
      .lean()
      .exec();

    const activeContracts = await this.contractModel.find({ status: 'active' }).lean().exec();

    return rooms.map((room: any) => {
      const contract = activeContracts.find(c => 
        c.roomId?.toString().trim() === room._id?.toString().trim()
      );

      const tenantProfile = room.currentTenant?.profile || null;

      return {
        ...room,
        monthlyPrice: room.prices || 0, // แมปราคาจาก prices ใน DB
        furniture: room.amenities || [], // แมปเฟอร์นิเจอร์จาก amenities ใน DB
        lastMeter: room.lastMeterReading || null,
        tenantInfo: tenantProfile ? {
          fullName: tenantProfile.fullName,
          phone: tenantProfile.phone,
          email: room.currentTenant?.email
        } : null,
        contractDetails: contract ? {
          startDate: contract.startDate,
          endDate: contract.endDate,
          deposit: contract.financials?.deposit || 0,
          advancePayment: contract.financials?.advancePayment || 0
        } : null
      };
    });
  }

  // ✅ ฟังก์ชันหาห้องพักจาก ID ผู้เช่า (แก้ Error TS2339 ใน maintenance.service.ts)
  async findByTenant(tenantId: string): Promise<RoomDocument> {
    const room = await this.roomModel
      .findOne({ currentTenant: tenantId })
      .exec();

    if (!room) {
      throw new NotFoundException('ไม่พบห้องพักที่เชื่อมโยงกับผู้เช่ารายนี้');
    }

    return room;
  }

  // ✅ ฟังก์ชันดึงรายละเอียดห้องเดียว
  async findOne(id: string): Promise<any> {
    const room = await this.roomModel.findById(id).populate('currentTenant', 'profile email').lean().exec();
    if (!room) throw new NotFoundException('ไม่พบห้องพัก');

    const contract = await this.contractModel.findOne({ roomId: id, status: 'active' }).lean().exec();
    const tenantProfile = (room as any).currentTenant?.profile;

    return {
      ...room,
      monthlyPrice: (room as any).prices || 0,
      furniture: (room as any).amenities || [],
      lastMeter: (room as any).lastMeterReading || null,
      tenantInfo: tenantProfile ? {
        fullName: tenantProfile.fullName,
        phone: tenantProfile.phone
      } : null,
      contractDetails: contract ? {
        startDate: contract.startDate,
        endDate: contract.endDate,
        deposit: contract.financials?.deposit || 0
      } : null
    };
  }

  // ✅ ฟังก์ชันสร้างห้อง
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.roomModel(createRoomDto);
    return newRoom.save();
  }

  // ✅ ฟังก์ชันอัปเดตสถานะห้อง
  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!room) throw new NotFoundException('ไม่พบห้องพัก');
    return room;
  }
}