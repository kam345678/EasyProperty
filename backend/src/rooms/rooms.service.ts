import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument, RoomStatus } from './schema/room.schema';
import { Contract, ContractDocument } from '../contracts/schemas/contract.schema';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Contract.name) private readonly contractModel: Model<ContractDocument>,
  ) {}

  // ✅ 1. อัปเดตเฟอร์นิเจอร์ลง DB (ปรับปรุงให้รองรับ Error Handling ที่ดีขึ้น)
  async updateAmenities(id: string, amenities: string[]): Promise<Room> {
    // ตรวจสอบความถูกต้องของ ID ก่อนยิง Query
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID ห้องพักไม่ถูกต้อง');
    }

    try {
      const room = await this.roomModel.findByIdAndUpdate(
        id,
        { $set: { amenities: amenities } }, // ใช้ $set เพื่อเขียนทับข้อมูล Array เดิม
        { new: true, runValidators: true } // คืนค่าตัวใหม่และรัน Schema Validation
      ).exec();

      if (!room) {
        throw new NotFoundException(`ไม่พบห้องพัก ID: ${id}`);
      }

      console.log(`[Service] Updated amenities for room ${id} successfully`);
      return room;
    } catch (error) {
      console.error("MongoDB Update Error:", error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('ไม่สามารถอัปเดตข้อมูลลงฐานข้อมูลได้');
    }
  }

  // ✅ 2. ดึงข้อมูลทั้งหมดและ Mapping ให้หน้า Admin (ดึงข้อมูลครบทุกฟิลด์ที่หน้าบ้านต้องการ)
  async findAll(status?: RoomStatus): Promise<any[]> {
    const filter = status ? { status } : {};
    
    // ดึงห้องพักทั้งหมดพร้อมข้อมูลผู้เช่า
    const rooms = await this.roomModel
      .find(filter)
      .populate('currentTenant', 'profile email role')
      .sort({ floor: 1, roomNumber: 1 })
      .lean() // ใช้ lean เพื่อให้ได้ Plain Object (เร็วและกินแรมลดลง)
      .exec();

    // ดึงสัญญาที่เป็น Active ทั้งหมดมาไว้ในตัวแปรเดียว (เพื่อประหยัด Query ใน Loop)
    const activeContracts = await this.contractModel.find({ status: 'active' }).lean().exec();

    return rooms.map((room: any) => {
      // หาคิวสัญญาที่ตรงกับ ID ห้องนี้
      const contract = activeContracts.find(c => 
        c.roomId?.toString() === room._id?.toString()
      );

      const tenantProfile = room.currentTenant?.profile || null;

      return {
        ...room,
        monthlyPrice: room.prices || 0, // แมปราคาจาก prices
        furniture: room.amenities || [], // แมปเฟอร์นิเจอร์จาก amenities
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

  // ✅ 3. หาห้องพักจาก ID ผู้เช่า (ใช้ในระบบ Maintenance/แจ้งซ่อม)
  async findByTenant(tenantId: string): Promise<RoomDocument> {
    if (!Types.ObjectId.isValid(tenantId)) {
      throw new BadRequestException('ID ผู้เช่าไม่ถูกต้อง');
    }

    const room = await this.roomModel.findOne({ currentTenant: tenantId }).exec();
    
    if (!room) {
      throw new NotFoundException('ไม่พบห้องพักที่เชื่อมโยงกับผู้เช่ารายนี้');
    }
    return room;
  }

  // ✅ 4. ดึงรายละเอียดห้องเดียว
  async findOne(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID ห้องพักไม่ถูกต้อง');
    }

    const room = await this.roomModel
      .findById(id)
      .populate('currentTenant', 'profile email')
      .lean()
      .exec();

    if (!room) throw new NotFoundException('ไม่พบห้องพัก');

    const contract = await this.contractModel
      .findOne({ roomId: id, status: 'active' })
      .lean()
      .exec();

    const tenantProfile = (room as any).currentTenant?.profile;

    return {
      ...room,
      monthlyPrice: (room as any).prices || 0,
      furniture: (room as any).amenities || [],
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

  // ✅ 5. ฟังก์ชันสร้างห้อง
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.roomModel(createRoomDto);
    return newRoom.save();
  }

  // ✅ 6. อัปเดตสถานะห้อง (ว่าง/จอง/เต็ม)
  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID ห้องพักไม่ถูกต้อง');
    }

    const room = await this.roomModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!room) throw new NotFoundException('ไม่พบห้องพัก');
    return room;
  }
}