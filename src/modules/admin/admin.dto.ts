import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { USER_ROLES, type UserRole } from '../customer/types.js';

/** Fields required to create an account from the admin console. */
export class CreateUserDto {
  /** User's display name. */
  @IsString()
  @MinLength(1)
  name: string;

  /** Unique account email address. */
  @IsEmail()
  email: string;

  /** Initial password with at least eight characters. */
  @IsString()
  @MinLength(8)
  password: string;

  /** Role assigned to the new account. */
  @IsIn(USER_ROLES)
  role: UserRole;
}

/** User fields that an administrator may change. */
export class UpdateUserDto {
  /** Replacement display name. */
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  /** Replacement email address. */
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Replacement account role. */
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;

  /** Whether the account is allowed to sign in. */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
