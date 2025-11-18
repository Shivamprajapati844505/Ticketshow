import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.services';
import { AuthGuard } from './../middleware/auth.guard';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private bookingService: BookingsService) {}

  @Post('create')
  createBooking(@Req() req, @Body() body) {
    return this.bookingService.createBooking(req.clerkUser.id, body, req.headers.origin);
  }

  @Get('seats/:showId')
  getSeats(@Param('showId') showId: string) {
    return this.bookingService.getOccupiedSeats(showId);
  }
}
