import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User, UserDocument, UserRole } from './schemas/user.schema';

import { CreateUserByAdminDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  // สร้างผู้ใช้โดย Admin พร้อม generate password อัตโนมัติ
  async createUserByAdmin(dto: CreateUserByAdminDto) {
    const data = {
      email: dto.username,
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

    const birth = new Date(data.birthDate);
    const yyyy = birth.getFullYear();
    const mm = String(birth.getMonth() + 1).padStart(2, '0');
    const dd = String(birth.getDate()).padStart(2, '0');

    const rawPassword = `${emailPrefix}${yyyy}${mm}${dd}`;

    // hash password
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const user = await this.userModel.create({
      email: data.email,
      passwordHash,
      role: data.role ?? 'tenant',
    });

    return {
      message: 'User created successfully',
      temporaryPassword: rawPassword,
      user,
    };
  }
}
