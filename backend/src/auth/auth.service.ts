import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../users/dto/login.dto';

// AuthService handles user authentication and JWT generation
@Injectable()
export class AuthService {
  // Injects UsersService and JwtService
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validates user and generates JWT token
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // Validate user credentials
    const user = await this.usersService.validateUser(email, password);

    // Throws exception if user is not valid
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Creates JWT payload with user ID and email
    const payload = { id: user.id, email: user.email };
    // Signs the payload to generate JWT token
    const token = this.jwtService.sign(payload);

    // Returns the access token and user data
    return {
      accessToken: token,
      user,
    };
  }
}
