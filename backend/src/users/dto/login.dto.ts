import { IsEmail, IsNotEmpty } from 'class-validator';

// DTO for user login request payload
export class LoginDto {
  // Validates that email is in a valid email format
  @IsEmail()
  email: string;

  // Validates that password is not empty
  @IsNotEmpty()
  password: string;
}
