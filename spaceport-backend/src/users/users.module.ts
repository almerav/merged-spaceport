import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Defines the UsersModule to manage user-related functionality
@Module({
  imports: [
    // Imports MikroORM with User entity
    MikroOrmModule.forFeature({ entities: [User] }),
    // Configures JwtModule asynchronously with environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule], // Loads ConfigModule to access env variables
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Retrieves JWT secret
        signOptions: { expiresIn: '1h' }, // Sets token expiration to 1 hour
      }),
      inject: [ConfigService], // Injects ConfigService for config access
    }),
  ],
  // Defines the UsersController to handle incoming requests
  controllers: [UsersController],
  // Provides UsersService to manage user operations
  providers: [UsersService],
  // Exports UsersService for use in other modules
  exports: [UsersService],
})
export class UsersModule {}
