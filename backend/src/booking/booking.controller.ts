import { Controller, Get, Query } from '@nestjs/common'
import { BookingService } from './booking.service'
import { Booking } from '@prisma/client'

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('bookings')
  async findAll(@Query('status') status?: string): Promise<Booking[]> {
    return this.bookingService.findAll(status)
  }
}
