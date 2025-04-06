import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Marks this class as injectable for dependency injection
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Initializes JWT strategy with secret and token extraction
  constructor(configService: ConfigService) {
    super({
      // Extract JWT from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject expired tokens
      ignoreExpiration: false,
      // Retrieves JWT secret key from config
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // Validates JWT payload and returns user data
  async validate(payload: any) {
    return { id: payload.id, email: payload.email }; // Return user info
  }
}
