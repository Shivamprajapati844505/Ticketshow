import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ShowsService } from './shows.services';
import { AdminGuard } from './../middleware/admin.guard';
import { AuthGuard } from './../middleware/auth.guard';

@Controller('shows')
export class ShowsController {
  constructor(private showsService: ShowsService) {}

  @Get('now-playing')
  @UseGuards(AuthGuard, AdminGuard)
  getNowPlaying() {
    return this.showsService.getNowPlayingMovies();
  }

  @Post('add')
  @UseGuards(AuthGuard, AdminGuard)
  addShow(@Body() body) {
    return this.showsService.addShow(body);
  }

  @Get('all')
  getShows() {
    return this.showsService.getShows();
  }

  @Get(':movieId')
  getShow(@Param('movieId') movieId: string) {
    return this.showsService.getShow(movieId);
  }
}
