import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import type { UserRole } from '../modules/customer/types.js';
import type { AuthenticatedRequest } from './auth.guard.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const roles = Reflect.getMetadata(ROLES_KEY, context.getHandler()) as
      UserRole[] | undefined;
    if (!roles?.length || (request.user && roles.includes(request.user.role)))
      return true;
    throw new ForbiddenException('Insufficient role');
  }
}
