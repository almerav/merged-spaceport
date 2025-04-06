import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO for user creation request payload
export class CreateUserDto {
  // Validates that email is in a valid email format
  @IsEmail()
  email: string;

  // Validates that firstName is a string
  @IsString()
  firstName: string;

  // Validates that lastName is a string
  @IsString()
  lastName: string;

  // Validates that password has a minimum length of 6 characters
  @MinLength(6)
  password: string;

  // Validates that avatar is a string (URL or path)
  @IsString()
  avatar: string;
}
