import {
  Controller,
  Post,
  Patch,
  UseGuards,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserByAdminDto } from './dto/user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { UpdateAvatarDto } from './dto/avatar.url.dto';
interface JwtRequest extends Request {
  user: JwtPayload;
}

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  //=========> create Account by admin for tenant
  @Post('admin/create-user')
  @Roles('admin')
  @UseGuards(AccessTokenGuard, RolesGuard)
  createByAdmin(@Body() dto: CreateUserByAdminDto) {
    return this.usersService.createUserByAdmin(dto);
  }

  //=========> reset password
  @Patch('me/password')
  @Roles('tenant', 'admin')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async changePassword(
    @Req() req: JwtRequest,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmNewpassword') confirmNewpassword: string,
  ) {
    console.log('CHANGE PASSWORD HIT');
    console.log('USER FROM TOKEN:', req.user);
    console.log('OLD PASSWORD:', oldPassword);
    console.log('NEW PASSWORD:', newPassword);
    console.log('CONFIRM PASSWROD', confirmNewpassword);

    return this.usersService.changePassword(
      req.user.sub,
      oldPassword,
      newPassword,
      confirmNewpassword,
    );
  }

  // ====================> แก้ไขรูป avatar
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('tenant', 'admin')
  @Patch('me/avatar')
  updateMyAvatar(@Req() req: JwtRequest, @Body() dto: UpdateAvatarDto) {
    console.log('BODY avatarUrl:', dto.avatarUrl);
    console.log('BODY avatarPublicId:', dto.avatarPublicId);

    return this.usersService.updateAvatar(
      req.user.sub,
      dto.avatarUrl,
      dto.avatarPublicId,
    );
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
