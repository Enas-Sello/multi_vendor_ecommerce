import { IsEmail, IsString, MinLength } from 'class-validator';

/** Payload for creating a customer account. */
export class RegisterDto {
  /** Name displayed on the account profile. */
  @IsString()
  @MinLength(1)
  name: string;

  /** Account email address. */
  @IsEmail()
  email: string;

  /** Password with at least eight characters. */
  @IsString()
  @MinLength(8)
  password: string;
}

/** Credentials used to sign in. */
export class LoginDto {
  /** Account email address. */
  @IsEmail()
  email: string;

  /** Account password. */
  @IsString()
  @MinLength(1)
  password: string;
}
