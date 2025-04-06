import { EntityManager } from '@mikro-orm/core';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BaseSeeder } from './BaseSeeder';

export class UserSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    // Prevent running in production
    this.checkEnvironment();

    this.logStart('User');

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
      // Additional diverse user accounts
      {
        email: 'marketing@spaceport.com',
        firstName: 'Marketing',
        lastName: 'Specialist',
        password: await bcrypt.hash('marketpass', 10),
        avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
      },
      {
        email: 'sales@spaceport.com',
        firstName: 'Sales',
        lastName: 'Representative',
        password: await bcrypt.hash('salespass', 10),
        avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
      },
      {
        email: 'support@spaceport.com',
        firstName: 'Customer',
        lastName: 'Support',
        password: await bcrypt.hash('supportpass', 10),
        avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      },
      {
        email: 'finance@spaceport.com',
        firstName: 'Finance',
        lastName: 'Analyst',
        password: await bcrypt.hash('financepass', 10),
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      },
    ];

    let createdCount = 0;

    for (const userData of users) {
      // Check if user already exists to make seeder idempotent
      const exists = await this.exists(em, User, { email: userData.email });

      if (!exists) {
        em.create(User, userData);
        createdCount++;
      } else {
        this.logger.verbose(
          `User with email ${userData.email} already exists, skipping`,
        );
      }
    }

    this.logComplete('User', createdCount);
  }
}
