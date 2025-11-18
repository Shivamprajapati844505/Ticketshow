import { Controller, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Booking } from '../bookings/schemas/booking.schema';
import { ConfigService } from '@nestjs/config';

@Controller('stripe')
export class StripeController {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')! // <- FIXED
    );
  }

  @Post('webhook')
  async handleWebhook(@Req() req: any, @Res() res: any) {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET')! // <- FIXED
      );
    } catch (err: any) {
      console.error('Stripe webhook verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        const sessions = await this.stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessions.data[0];

        const bookingId =
          session?.metadata?.bookingId ||
          paymentIntent?.metadata?.bookingId;

        if (bookingId) {
          await this.bookingModel.findByIdAndUpdate(
            bookingId,
            { isPaid: true, paymentLink: '' }
          );
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Webhook processing error:', err);
      res.status(500).send('Internal server error');
    }
  }
}
