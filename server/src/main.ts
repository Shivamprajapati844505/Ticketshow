import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, raw } from 'body-parser';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Stripe webhook raw body
  app.getHttpAdapter().getInstance().post(
    '/stripe/webhook',
    raw({ type: 'application/json' }),
    (req, res, next) => next()
  );
  app.use('/stripe/webhook', express.raw({ type: '*/*' }));


  // normal json parser for other routes
  app.use(json());

  app.enableCors();

  await app.listen(3000);
 console.log('Server is listening at http://localhost:3000'); 
}

bootstrap();
