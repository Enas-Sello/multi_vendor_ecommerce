import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../modules/auth/auth.service.js';
import type { UserSession } from '../modules/customer/types.js';

export interface AuthenticatedRequest extends Request {
  user: UserSession;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const cookie = req.headers.cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('auth_token='));

    if (!cookie) throw new UnauthorizedException('Authentication required');

    req.user = await this.auth.authenticateActive(
      decodeURIComponent(cookie.slice('auth_token='.length)),
    );

    return true;
  }
}
