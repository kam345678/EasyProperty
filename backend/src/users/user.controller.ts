import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserByAdminDto } from './dto/user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/create-user')
  @Roles('admin')
  @UseGuards(AccessTokenGuard, RolesGuard)
  createByAdmin(@Body() dto: CreateUserByAdminDto) {
    return this.usersService.createUserByAdmin(dto);
  }
}
