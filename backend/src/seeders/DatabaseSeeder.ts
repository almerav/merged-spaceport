import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './UserSeeder';
import { TagSeeder } from './TagSeeder';
import { CampaignSeeder } from './CampaignSeeder';
import { TargetSeeder } from './TargetSeeder';
import { PerformanceSeeder } from './PerformanceSeeder';
import { Logger } from '@nestjs/common';

/**
 * Main database seeder that orchestrates all other seeders
 */
export class DatabaseSeeder extends Seeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  async run(em: EntityManager): Promise<void> {
    // Check if we're in production
    const nodeEnv = process.env.NODE_ENV || 'development';
    const isProduction = nodeEnv === 'production';

    if (isProduction) {
      this.logger.error('Seeding is not allowed in production environment');
      throw new Error('Seeding is not allowed in production environment');
    }

    this.logger.log('Starting database seeding...');

    // Run all seeders in the correct order to respect dependencies
    await this.call(em, [
      UserSeeder, // Users must be seeded first (campaigns depend on users)
      TagSeeder, // Tags can be seeded independently
      CampaignSeeder, // Campaigns depend on users
      TargetSeeder, // Targets depend on campaigns
      PerformanceSeeder, // Performance data depends on campaigns
    ]);

    this.logger.log('Database seeding completed successfully!');
  }
}
