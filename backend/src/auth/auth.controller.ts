import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

// Defines the auth controller with the base route 'auth'
@Controller('auth')
export class AuthController {
  // Injects AuthService into the controller
  constructor(private readonly authService: AuthService) {}

  // Handles user login and returns a JWT token
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Protects the 'profile' route using JwtAuthGuard
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  // Retrieves authenticated user's profile from request
  getProfile(@Req() req) {
    return req.user;
  }
}
