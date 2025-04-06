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
import { MailerService } from '../mailer/mailer.service'; // adjust the path if needed


// UsersService handles user-related operations
@Injectable()
export class UsersService {
  // Injects EntityManager and JwtService
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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
  //generate reset link
  async sendResetLink(email: string) {
    const user = await this.em.findOne(User, { email });
    if (!user) throw new NotFoundException('User not found');
  
    // Create a reset token valid for 15 minutes
    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });
  
    // Normally you'd send an email, but for dev you can just return the link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await this.mailerService.sendEmail(
      user.email,
      'Reset Your Spaceport Password',
      `Click the link below to reset your password:\n\n${resetLink}`,
      `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    );
  
    return {
      message: 'Reset link generated',
      resetLink, // You can use this in your frontend dev/test
    };
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
    const { token, newPassword } = resetPasswordDto;

    let payload: { email: string };
    try {
      // ✅ Decode the token to get the email
      payload = this.jwtService.verify(token) as { email: string };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.em.findOne(User, { email: payload.email });
    if (!user) throw new NotFoundException('User not found');

    // ✅ Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await this.em.flush();

    return { message: 'Password reset successfully' };

  }
}
