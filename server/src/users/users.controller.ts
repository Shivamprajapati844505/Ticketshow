// src/users/users.controller.ts
import { Controller, Get, Post, Req, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.services';
import { AuthGuard } from './../middleware/auth.guard';
import { verifyClerkJwt } from '../config/clerk.jwt';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  private async extractClerkUserId(req: any): Promise<string> {
    if (req?.clerkUser?.id) return req.clerkUser.id;

    const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException('Missing Authorization header');
    const token = authHeader.split(' ')[1];

    try {
      const payload = await verifyClerkJwt(token);
      if (!payload?.sub) throw new UnauthorizedException('Invalid token payload');
      return payload.sub;
    } catch (err) {
      console.log('Controller token verify fallback error:', err.message || err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get('bookings')
  async getUserBookings(@Req() req) {
    const clerkUserId = await this.extractClerkUserId(req);
    return this.usersService.getUserBookings(clerkUserId);
  }

  @Post('update-favorite')
  async updateFavorite(@Req() req, @Body() body: { movieId: string }) {
    const clerkUserId = await this.extractClerkUserId(req);
    return this.usersService.updateFavorite(clerkUserId, body.movieId);
  }

  @Get('favorites')
  async getFavorites(@Req() req) {
    const clerkUserId = await this.extractClerkUserId(req);
    return this.usersService.getFavorites(clerkUserId);
  }
}
