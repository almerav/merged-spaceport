import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = [
      {
        email: 'admin@spaceport.com',
        firstName: 'Admin',
        lastName: 'User',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'user@spaceport.com',
        firstName: 'Regular',
        lastName: 'User',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'test@spaceport.com',
        firstName: 'Test',
        lastName: 'User',
        password: await bcrypt.hash('password123', 10),
      },
    ];

    for (const userData of users) {
      em.create(User, userData);
    }
  }
}
