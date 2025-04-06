import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';

/**
 * Base seeder class that provides common functionality for all seeders
 */
export abstract class BaseSeeder extends Seeder {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Check if we're in a production environment
   */
  protected isProduction(): boolean {
    const nodeEnv = process.env.NODE_ENV || 'development';
    return nodeEnv === 'production';
  }

  /**
   * Prevent running seeders in production unless explicitly allowed
   */
  protected checkEnvironment(allowInProduction = false): void {
    if (this.isProduction() && !allowInProduction) {
      this.logger.error('Seeding is not allowed in production environment');
      throw new Error('Seeding is not allowed in production environment');
    }
  }

  /**
   * Check if an entity with the given criteria already exists
   */
  protected async exists<T>(
    em: EntityManager,
    entityClass: new () => T,
    criteria: Record<string, any>,
  ): Promise<boolean> {
    const count = await em.count(entityClass, criteria);
    return count > 0;
  }

  /**
   * Log the start of the seeding process
   */
  protected logStart(name: string): void {
    this.logger.log(`Starting ${name} seeder...`);
  }

  /**
   * Log the completion of the seeding process
   */
  protected logComplete(name: string, count: number): void {
    this.logger.log(`Completed ${name} seeder. Created ${count} records.`);
  }

  /**
   * Abstract method that must be implemented by all seeders
   */
  abstract run(em: EntityManager): Promise<void>;
}
