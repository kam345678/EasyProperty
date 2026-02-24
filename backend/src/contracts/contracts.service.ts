// src/contracts/contracts.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { CreateContractDto } from './dto/create-contract.dto';
// import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name)
    private contractModel: Model<ContractDocument>,
  ) {}

  async create(createDto: CreateContractDto) {
    const contract = new this.contractModel({
      roomId: createDto.roomId,
      tenantId: createDto.tenantId,
      type: createDto.type,
      startDate: createDto.startDate,
      endDate: createDto.endDate,
      status: createDto.status,
      financials: {
        deposit: createDto.financials.deposit,
        advancePayment: createDto.financials.advancePayment,
      },
    });

    return await contract.save(); // 🔥 ต้องมี await
  }

  async findAll() {
    return this.contractModel
      .find()
      .populate('roomId')
      .populate('tenantId')
      .exec();
  }

  async findOne(id: string) {
    const contract = await this.contractModel
      .findById(id)
      .populate('roomId')
      .populate('tenantId');

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  //   async update(id: string, updateDto: UpdateContractDto) {
  //     const updated = await this.contractModel.findByIdAndUpdate(id, updateDto, {
  //       new: true,
  //     });

  //     if (!updated) {
  //       throw new NotFoundException('Contract not found');
  //     }

  //     return updated;
  //   }

  async remove(id: string) {
    const deleted = await this.contractModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Contract not found');
    }

    return { message: 'Contract deleted successfully' };
  }
}
