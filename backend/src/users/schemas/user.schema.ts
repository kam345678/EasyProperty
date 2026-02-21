// src/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserRole = 'admin' | 'tenant' | 'staff'; // สามารถกำหนดประเภทผู้ใช้ในฐานข้อมูลได้

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true, // อีเมลเป็นฟิลด์ที่จำเป็นต้องมี
    unique: true, // ระบบนี้จะไม่อนุญาตให้มีอีเมลซ้ำกัน
    lowercase: true, // แปลงอีเมลเป็นตัวพิมพ์เล็กทั้งหมด
    trim: true, // ลบช่องว่างที่ไม่จำเป็น
    index: true, // สร้างดัชนีเพื่อเพิ่มประสิทธิภาพการค้นหา
  })
  email: string;

  @Prop({ required: true, select: false }) // รหัสผ่านเป็นฟิลด์ที่จำเป็นและจะไม่ถูกเลือกโดยค่าเริ่มต้นเมื่อดึงข้อมูลผู้ใช้
  passwordHash: string;

  @Prop({ required: true, default: 'tenant' })
  role: UserRole;

  @Prop({ type: String, select: false, default: null })
  refreshTokenHash?: string | null;

  @Prop({
    type: {
      fullName: { type: String, default: null },
      phone: { type: String, default: null },
      idCardNumber: { type: String, default: null },
      avatar: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
      },
      _id: false,
      birthDate: { type: Date, default: null },
    },
    default: null,
  })
  profile: {
    fullName: string | null;
    phone: string | null;
    idCardNumber: string | null;
    avatar: {
      url: string | null;
      publicId: string | null;
    };
    birthDate: Date | null;
  } | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
