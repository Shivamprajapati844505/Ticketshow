// src/middleware/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyClerkJwt } from '../config/clerk.jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await verifyClerkJwt(token);
      // store minimal info for controllers/services
      req.clerkUser = {
        id: payload.sub,
        email: payload.email,
        payload,
      };
      return true;
    } catch (err) {
      console.log('AUTH GUARD ERROR:', err.message || err);
      return false;
    }
  }
}
