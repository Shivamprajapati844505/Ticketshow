import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { clerkClient } from '@clerk/clerk-sdk-node';

import { Booking } from '../bookings/schemas/booking.schema';
import { Movie } from '../shows/schemas/movie.schema';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  
  async getUserBookings(clerkUserId: string) {
    const bookings = await this.bookingModel
      .find({ user: clerkUserId })
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });

    return { success: true, bookings };
  }

  // UPDATE FAVORITES
  
 async updateFavorite(clerkUserId: string, movieId: string) {
  const user = await clerkClient.users.getUser(clerkUserId);

  const metadata = user.privateMetadata as { favorites?: string[] };

  if (!metadata.favorites) metadata.favorites = [];

  if (!metadata.favorites.includes(movieId)) {
    metadata.favorites.push(movieId);
  } else {
    metadata.favorites = metadata.favorites.filter(id => id !== movieId);
  }

  await clerkClient.users.updateUserMetadata(clerkUserId, {
    privateMetadata: metadata,
  });

  return { success: true, message: 'Favorite movie updated' };
}


async getFavorites(clerkUserId: string) {
  const user = await clerkClient.users.getUser(clerkUserId);
  const metadata = (user.privateMetadata || {}) as { favorites?: string[] };
  const favorites = metadata.favorites || [];
  const movies = await this.movieModel.find({ _id: { $in: favorites } });
  return { success: true, movies };
}

}
