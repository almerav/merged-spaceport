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
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        email: 'user@spaceport.com',
        firstName: 'Regular',
        lastName: 'User',
        password: await bcrypt.hash('password123', 10),
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        email: 'test@spaceport.com',
        firstName: 'Test',
        lastName: 'User',
        password: await bcrypt.hash('password123', 10),
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      // Enhanced sample data with more diverse users
      {
        email: 'developer@spaceport.com',
        firstName: 'Developer',
        lastName: 'Smith',
        password: await bcrypt.hash('devpass123', 10),
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      },
      {
        email: 'manager@spaceport.com',
        firstName: 'Project',
        lastName: 'Manager',
        password: await bcrypt.hash('managerpass', 10),
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
      {
        email: 'designer@spaceport.com',
        firstName: 'UI',
        lastName: 'Designer',
        password: await bcrypt.hash('designpass', 10),
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      },
      {
        email: 'qa@spaceport.com',
        firstName: 'Quality',
        lastName: 'Assurance',
        password: await bcrypt.hash('qapass123', 10),
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      },
      {
        email: 'devops@spaceport.com',
        firstName: 'DevOps',
        lastName: 'Engineer',
        password: await bcrypt.hash('opspass123', 10),
        avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
      },
    ];

    for (const userData of users) {
      em.create(User, userData);
    }
  }
}
