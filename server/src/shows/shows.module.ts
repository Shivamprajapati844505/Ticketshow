import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.services';
import { Show, ShowSchema } from './schemas/show.schema';
import { Movie, MovieSchema } from '../shows/schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Show.name, schema: ShowSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [ShowsController],
  providers: [ShowsService],
  exports: [ShowsService],
})
export class ShowsModule {}
