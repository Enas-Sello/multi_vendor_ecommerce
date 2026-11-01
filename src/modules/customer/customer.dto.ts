import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/** Fields a signed-in user may change on their profile. */
export class UpdateProfileDto {
  /** New display name. */
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  /** New account email address. */
  @IsOptional()
  @IsEmail()
  email?: string;
}
