import { Controller, Get } from '@nestjs/common';
import { UpcomingService } from './upcoming.service';

@Controller('movies')
export class UpcomingController {
  constructor(private upcomingService: UpcomingService) {}

  @Get('upcoming')
  getUpcomingMovies() {
    return this.upcomingService.getUpcomingMovies();
  }
}
