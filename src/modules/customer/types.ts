import type { HydratedDocument } from 'mongoose';
import type { User } from './user.schema.js';

export const USER_ROLES = ['admin', 'customer', 'seller', 'support'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export type UserDocument = HydratedDocument<User>;

export interface UserSession {
  sub: string;
  email: string;
  role: UserRole;
}
