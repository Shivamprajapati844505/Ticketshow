import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking {
   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: any; 

  @Prop({ type: Types.ObjectId, ref: 'Show', required: true })
  show: any;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, type: Array })
  bookedSeats: any[];

  @Prop({ default: false })
  isPaid: boolean;

 @Prop({ type: String, default: '' })
 paymentLink?: string | null;

}

export const BookingSchema = SchemaFactory.createForClass(Booking);
