import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../middleware/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('is-admin')
  @UseGuards(AdminGuard)
  isAdmin() {
    return this.adminService.isAdmin();
  }

  @Get('dashboard')
  @UseGuards(AdminGuard)
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('all-shows')
  @UseGuards(AdminGuard)
  getAllShows() {
    return this.adminService.getAllShows();
  }

  @Get('all-bookings')
  @UseGuards(AdminGuard)
  getAllBookings() {
    return this.adminService.getAllBookings();
  }
}
