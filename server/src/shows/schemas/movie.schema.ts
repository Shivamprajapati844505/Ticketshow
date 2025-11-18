import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  overview: string;

  @Prop({ required: true })
  poster_path: string;

  @Prop({ required: true })
  backdrop_path: string;

  @Prop({ required: true })
  release_date: string;

  @Prop()
  original_language: string;

  @Prop()
  tagline: string;

  @Prop({ required: true, type: Array })
  genres: any[];

  @Prop({ required: true, type: Array })
  casts: any[];

  @Prop({ required: true })
  vote_average: number;

  @Prop({ required: true })
  runtime: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
