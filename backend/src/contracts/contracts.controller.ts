// src/contracts/contracts.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';

@Controller('contracts')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createDto: CreateContractDto) {
    return this.contractsService.create(createDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.contractsService.findAll();
  }

  @Get('me')
  @Roles('tenant')
  getMyContract(@Req() req: any) {
    const userId = req.user.sub;
    return this.contractsService.findByTenantId(userId);
  }

  @Get(':id')
  @Roles('admin', 'tenant')
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateDto: UpdateContractDto) {
    return this.contractsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
}
