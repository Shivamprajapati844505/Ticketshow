import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ClerkMiddleware } from './middleware/clerk.middleware';

import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ShowsModule } from './shows/shows.module';
import { BookingsModule } from './bookings/bookings.module';
import { UpcomingModule } from './upcoming/upcoming.module';

import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { StripeController } from './payments/stripe.controller';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AdminModule,
    UsersModule,
    ShowsModule,
    BookingsModule,
    UpcomingModule,
    PaymentsModule, 
  ],           
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClerkMiddleware).forRoutes('*');
  }
}
