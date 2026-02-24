// src/contracts/contracts.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  //   Patch,
  Delete,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
// import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body() createDto: CreateContractDto) {
    return this.contractsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateDto: UpdateContractDto) {
  //     return this.contractsService.update(id, updateDto);
  //   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
}
