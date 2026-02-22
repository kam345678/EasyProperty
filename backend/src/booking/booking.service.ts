import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Booking } from '@prisma/client'

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string): Promise<Booking[]> {
    const where = status && status !== 'All' ? { status } : {}
    return this.prisma.booking.findMany({ where, orderBy: { check_in: 'desc' } })
  }
}
