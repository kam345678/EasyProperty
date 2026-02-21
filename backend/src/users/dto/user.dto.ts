import {
  IsEmail,
  IsIn,
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProfileDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  idCardNumber: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  avatarPublicId?: string | null;
  // avatar: {
  //   url: string | null;
  //   publicId: string | null;
  // };

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}

export class CreateUserByAdminDto {
  @IsEmail()
  email: string;

  @IsIn(['admin', 'tenant'])
  role: 'admin' | 'tenant';

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
