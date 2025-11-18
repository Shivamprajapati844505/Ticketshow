import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/express';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    try {
      const { userId } = req.auth();

      if (!userId) throw new UnauthorizedException();

      const user = await clerkClient.users.getUser(userId);

      if (user.privateMetadata?.role !== 'admin') {
        throw new UnauthorizedException('Not authorized');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Not authorized');
    }
  }
}
