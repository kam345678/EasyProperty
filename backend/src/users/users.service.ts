import { Injectable } from '@nestjs/common';

import * as argon2 from 'argon2';

import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User, UserDocument, UserRole } from './schemas/user.schema';
import { UploadService } from '../upload/upload.service';

import { CreateUserByAdminDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly uploadService: UploadService,
  ) {}

  // ค้นหาผู้ใช้โดยใช้อีเมล
  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // ใช้ตอน login: ต้องดึง passwordHash และ refreshTokenHash
  findByEmailWithSecrets(email: string) {
    return this.userModel
      .findOne({ email })
      .select('+passwordHash +refreshTokenHash')
      .exec();
  }

  // ใช้ตอน refresh: ต้องดึง refreshTokenHash
  findByIdWithRefresh(userId: string) {
    return this.userModel.findById(userId).select('+refreshTokenHash').exec();
  }

  // สร้างผู้ใช้ใหม่ โดยกำหนด role ได้
  create(data: { email: string; passwordHash: string; role?: UserRole }) {
    return this.userModel.create({
      email: data.email,

      passwordHash: data.passwordHash,

      role: data.role ?? 'tenant', // กำหนดค่าเริ่มต้นเป็น 'tenant' หากไม่ระบุ role
    });
  }

  // อัพเดท refreshTokenHash
  setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.userModel
      .updateOne({ _id: userId }, { refreshTokenHash })
      .exec();
  }

  // อัพเดทบทบาทผู้ใช้
  setRole(userId: string, role: UserRole) {
    return this.userModel.updateOne({ _id: userId }, { role }).exec();
  }

  // ============   สร้างผู้ใช้โดย Admin พร้อม generate password อัตโนมัติ ================== //
  async createUserByAdmin(dto: CreateUserByAdminDto) {
    const data = {
      email: dto.email,
      role: dto.role,
      birthDate: dto.profile.birthDate,
    };
    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // สร้างรหัสผ่านจาก email prefix + birthDate (YYYYMMDD)
    const emailPrefix = data.email.split('@')[0];

    if (!data.birthDate) {
      throw new BadRequestException('Birth date is required');
    }
    const birth = new Date(data.birthDate);
    const yyyy = birth.getFullYear();
    const mm = String(birth.getMonth() + 1).padStart(2, '0');
    const dd = String(birth.getDate()).padStart(2, '0');

    const rawPassword = `${emailPrefix}${dd}${mm}${yyyy}`;

    // hash password
    const passwordHash = await argon2.hash(rawPassword);

    const user = await this.userModel.create({
      email: data.email,
      passwordHash,
      role: data.role ?? 'tenant',
      profile: {
        fullName: dto.profile.fullName,
        phone: dto.profile.phone,
        idCardNumber: dto.profile.idCardNumber,
        avatar: {
          url: dto.profile.avatarUrl ?? null,
          publicId: dto.profile.avatarPublicId ?? null,
        },
        birthDate: dto.profile.birthDate
          ? new Date(dto.profile.birthDate)
          : null,
      },
    });
    return {
      message: 'User created successfully',
      temporaryPassword: rawPassword,
      user,
    };
  }

  //=========================== เปลี่ยนรหัสผ่านโดย tenant ==================================//
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId).select('+passwordHash');

    if (!user) throw new NotFoundException();

    const matches = await argon2.verify(user.passwordHash, oldPassword);

    if (!matches) throw new UnauthorizedException('รหัสเดิมไม่ถูกต้อง');

    const newHash = await argon2.hash(newPassword);

    user.passwordHash = newHash;
    await user.save();

    return { message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
  }

  //====================================== เปลี่ยนรูป avatar ====================================
  async updateAvatar(
    userId: string,
    avatarUrl: string,
    avatarPublicId: string,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldPublicId = user.profile?.avatar?.publicId ?? null;

    user.profile = {
      fullName: user.profile?.fullName ?? null,
      phone: user.profile?.phone ?? null,
      idCardNumber: user.profile?.idCardNumber ?? null,
      birthDate: user.profile?.birthDate ?? null,
      avatar: {
        url: avatarUrl,
        publicId: avatarPublicId,
      },
    };

    await user.save();

    if (oldPublicId) {
      // ลบรูปเก่าหลังจากบันทึกสำเร็จ
      await this.uploadService.deleteImage(oldPublicId);
      // ต้อง inject UploadService ถ้ายังไม่ได้ทำ
      // await this.uploadService.deleteImage(oldPublicId);
    }

    return {
      message: 'อัปเดตรูปโปรไฟล์สำเร็จ',
      avatar: {
        url: avatarUrl,
        publicId: avatarPublicId,
      },
    };
  }

  /* ========== ส่งprofile ให้auth =============== */
  async findById(id: string) {
    return this.userModel.findById(id).select('-passwordHash').exec();
  }
}
