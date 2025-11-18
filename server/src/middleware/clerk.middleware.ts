import { Injectable, NestMiddleware } from '@nestjs/common';
import { clerkMiddleware } from '@clerk/express';

@Injectable()
export class ClerkMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    return clerkMiddleware()(req, res, next);
  }
}
