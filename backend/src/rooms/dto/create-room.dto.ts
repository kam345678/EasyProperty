import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/* ============================= */
/* ENUMS */
/* ============================= */

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

/* ============================= */
/* NESTED DTO */
/* ============================= */

export class LastMeterReadingDto {
  @IsNumber()
  @Min(0)
  water: number;

  @IsNumber()
  @Min(0)
  electric: number;

  @IsOptional()
  updatedAt?: Date;
}

/* ============================= */
/* MAIN DTO */
/* ============================= */

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsNumber()
  @Min(1)
  floor: number;

  @IsEnum(RoomType)
  roomType: RoomType;

  @IsNumber()
  prices: number;
  @IsOptional()
  @IsEnum(RoomStatus)
  status: RoomStatus;

  @IsOptional()
  @IsMongoId()
  currentTenant?: string; // ObjectId (string form)

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LastMeterReadingDto)
  lastMeterReading?: LastMeterReadingDto;
}
