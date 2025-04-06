import { IsJWT, MinLength } from 'class-validator';

export class ResetPasswordDto {
  // Token from the URL query string (e.g. reset-password?token=...)
  @IsJWT()
  token: string;

  // New password input by the user
  @MinLength(6)
  newPassword: string;
}
