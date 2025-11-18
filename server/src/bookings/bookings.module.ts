import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.services';
import { BookingsController } from './bookings.controller';

import { Booking, BookingSchema } from './schemas/booking.schema';
import { Show, ShowSchema } from '../shows/schemas/show.schema';
import { Movie, MovieSchema } from '../shows/schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Show.name, schema: ShowSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService,],
  exports: [BookingsService], 
})
export class BookingsModule {}
