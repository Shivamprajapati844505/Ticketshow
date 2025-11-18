import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ minimize: false })
export class Show {
  @Prop({ required: true, ref: 'Movie' })
  movie: string;

  @Prop({ required: true })
  showDateTime: Date;

  @Prop({ required: true })
  showPrice: number;

  @Prop({ type: Object, default: {} })
  occupiedSeats: Record<string, any>;
}

export const ShowSchema = SchemaFactory.createForClass(Show);
