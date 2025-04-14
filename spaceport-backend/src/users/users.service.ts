import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// UsersService handles user-related operations
@Injectable()
export class UsersService {
  // Injects EntityManager and JwtService
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Register new user (No Manual Hashing Needed)
  async register(createUserDto: CreateUserDto) {
    // Check if email already exists
    const exists = await this.em.findOne(User, { email: createUserDto.email });
    if (exists) throw new BadRequestException('Email already in use');

    // Create and persist new user (password hashed in @BeforeCreate)
    const user = this.em.create(User, createUserDto);
    await this.em.persistAndFlush(user);
    return { message: 'User registered successfully' };
  }

  // ✅ Validate user credentials
  async validateUser(email: string, password: string): Promise<User | null> {
    // Find user by email
    const user = await this.em.findOne(User, { email });
    // Check if password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // ✅ Login to generate JWT token
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // Validate user credentials
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token with user ID and email
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user,
    };
  }

  // ✅ Fetch all users
  async findAll() {
    return await this.em.find(User, {}); // Returns all users
  }

  // ✅ Reset user password securely
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Find user by email
    const user = await this.em.findOne(User, { email: resetPasswordDto.email });
    if (!user) throw new NotFoundException('User not found');

    // Hash new password and update user record
    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.em.flush();
    return { message: 'Password reset successfully' };
  }
}
