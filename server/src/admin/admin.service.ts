import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from '../bookings/schemas/booking.schema';
import { Model } from 'mongoose';
import { Show } from '../shows/schemas/show.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Show.name) private showModel: Model<Show>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async isAdmin() {
    return { success: true, isAdmin: true };
  }

  async getDashboard() {
    const bookings = await this.bookingModel.find({ isPaid: true });
    const activeShows = await this.showModel
      .find({ showDateTime: { $gte: new Date() } })
      .populate('movie');

    const totalUsers = await this.userModel.countDocuments();

    return {
      success: true,
      dashboardData: {
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((a, b) => a + b.amount, 0),
        activeShows,
        totalUsers,
      },
    };
  }

  async getAllShows() {
    const shows = await this.showModel
      .find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    return { success: true, shows };
  }

  async getAllBookings() {
    const bookings = await this.bookingModel
      .find({})
      .populate('user')
      .populate({ path: 'show', populate: { path: 'movie' } })
      .sort({ createdAt: -1 });

    return { success: true, bookings };
  }
}
