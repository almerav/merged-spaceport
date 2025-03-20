import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async createUser(email: string, password: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    await user.hashPassword();
    await this.em.persistAndFlush(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }
}
