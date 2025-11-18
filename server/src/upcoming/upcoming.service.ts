import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UpcomingService {
  async getUpcomingMovies() {
    try {
      const { data } = await axios.get(
        'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY_1}`,
            accept: 'application/json',
          },
        },
      );

      return { success: true, movies: data.results };
    } catch (error) {
      console.error(error.message);
      return { success: false, message: 'Failed to fetch upcoming movies' };
    }
  }
}
