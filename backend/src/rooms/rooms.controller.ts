import { Controller, Post, Get, Param, Body, Query, Patch, ParseEnumPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStatus } from './schema/room.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll(@Query('status') status?: RoomStatus) {
    return this.roomsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  // ✅ แก้ไขตรงนี้: รับเป็น Object เพื่อแก้ Error 400
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/amenities')
  async updateAmenities(
    @Param('id') id: string,
    @Body() body: { amenities: string[] }, 
  ) {
    console.log(`[Backend Log] ID: ${id}, Data:`, body);

    if (!body || !Array.isArray(body.amenities)) {
      throw new BadRequestException('amenities must be an array of strings');
    }

    return this.roomsService.updateAmenities(id, body.amenities);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(RoomStatus)) status: RoomStatus,
  ) {
    return this.roomsService.updateStatus(id, status);
  }
}