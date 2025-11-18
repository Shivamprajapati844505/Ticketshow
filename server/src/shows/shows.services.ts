import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { Show } from './schemas/show.schema';
import { Movie } from '../shows/schemas/movie.schema';

@Injectable()
export class ShowsService {
  constructor(
    @InjectModel(Show.name) private showModel: Model<Show>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  // 🔵 NOW PLAYING MOVIES FROM TMDB
  async getNowPlayingMovies() {
    const { data } = await axios.get(
      'https://api.themoviedb.org/3/movie/now_playing',
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      },
    );
    return { success: true, movies: data.results };
  }

  // 🟢 ADD NEW SHOW
  async addShow(body) {
    const { movieId, showsInput, showPrice } = body;

    let movie = await this.movieModel.findById(movieId);

    // Fetch from TMDB if movie not in DB
    if (!movie) {
      const [details, credits] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY_1}`,
            accept: 'application/json',
          },
        }),
        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_KEY_1}`,
              accept: 'application/json',
            },
          },
        ),
      ]);

      movie = await this.movieModel.create({
        _id: movieId,
        title: details.data.title,
        overview: details.data.overview,
        poster_path: details.data.poster_path,
        backdrop_path: details.data.backdrop_path,
        genres: details.data.genres,
        casts: credits.data.cast,
        release_date: details.data.release_date,
        original_language: details.data.original_language,
        tagline: details.data.tagline || ' ',
        vote_average: details.data.vote_average,
        runtime: details.data.runtime,
      });
    }

    // SHOWS CREATE ARRAY (FIXED TYPE)
    const showsToCreate: any[] = [];

    showsInput.forEach((s) => {
      const date = s.date;
      s.time.forEach((time) => {
        const dateTime = `${date}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTime),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length) {
      await this.showModel.insertMany(showsToCreate);
    }

    return { success: true, message: 'Show added successfully.' };
  }

  // 🔵 GET ALL UPCOMING SHOWS
  async getShows() {
    const shows = await this.showModel
      .find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const unique = new Set(shows.map((s) => s.movie));
    return { success: true, shows: Array.from(unique) };
  }

  // 🔵 GET SPECIFIC MOVIE SHOWS
  async getShow(movieId: string) {
    const shows = await this.showModel.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await this.movieModel.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) dateTime[date] = [];

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    return { success: true, movie, dateTime };
  }
}
