import { IsEmail, MinLength } from 'class-validator';

// DTO for resetting user password
export class ResetPasswordDto {
  // Validates that email is in a valid email format
  @IsEmail()
  email: string;

  // Validates that newPassword has a minimum length of 6 characters
  @MinLength(6)
  newPassword: string;
}
