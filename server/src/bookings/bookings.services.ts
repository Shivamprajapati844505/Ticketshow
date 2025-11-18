import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Booking } from './schemas/booking.schema';
import { Show } from '../shows/schemas/show.schema';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Show.name) private showModel: Model<Show>,
  ) {}

  private getMovieName(movie: any): string {
    if (!movie) return 'Movie Ticket';
    if (typeof movie === 'string') return movie;
    if (movie.title) return movie.title;
    if (movie.name) return movie.name;
    return 'Movie Ticket';
  }

  async getOccupiedSeats(showId: string) {
    const show = await this.showModel.findById(showId);
    if (!show) throw new Error('Show not found');
    return show.occupiedSeats;
  }

  async checkSeatsAvailability(showId: string, seats: string[]) {
    const show = await this.showModel.findById(showId);
    if (!show) throw new Error('Show not found');

    const occupied = show.occupiedSeats || {};
    const conflict = seats.some((seat) => occupied[seat]);
    return !conflict;
  }

  async createBooking(userId: string, body, origin: string) {
    const { showId, selectedSeats } = body;

    const available = await this.checkSeatsAvailability(showId, selectedSeats);
    if (!available) {
      return { success: false, message: 'Selected seats are not available.' };
    }

    const show = await this.showModel.findById(showId).populate('movie');
    if (!show) throw new Error('Show not found');

    if (!show.occupiedSeats) show.occupiedSeats = {};

    const booking = await this.bookingModel.create({
      user: userId,
      show: showId,
      amount: show.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // assign seats
    selectedSeats.forEach((seat) => (show.occupiedSeats[seat] = userId));
    show.markModified('occupiedSeats');
    await show.save();

    const movieName = this.getMovieName(show.movie);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: movieName },
            unit_amount: booking.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    booking.paymentLink = session.url;
    await booking.save();

    
    return { success: true, url: session.url };
  }
}
