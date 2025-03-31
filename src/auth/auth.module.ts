import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

// Auth module for handling authentication-related functionality
@Module({
  imports: [
    UsersModule, // Imports UsersModule for user-related operations
    PassportModule, // Enables Passport for authentication
    // Configures JwtModule asynchronously to load secret and options from config
    JwtModule.registerAsync({
      imports: [ConfigModule], // Imports ConfigModule for environment variables
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Retrieves JWT secret
        signOptions: { expiresIn: '1h' }, // Sets token expiration
      }),
      inject: [ConfigService], // Injects ConfigService for configuration
    }),
  ],
  controllers: [AuthController], // Defines AuthController to handle auth routes
  providers: [AuthService, JwtStrategy], // Provides AuthService and JwtStrategy
  exports: [AuthService], // Exports AuthService for use in other modules
})
export class AuthModule {}
