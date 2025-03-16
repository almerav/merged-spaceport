import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class MigrationValidatorService implements OnModuleInit {
  private readonly logger = new Logger(MigrationValidatorService.name);

  constructor(private readonly orm: MikroORM) {}

  /**
   * Validates that all migrations have been applied when the application starts
   */
  async onModuleInit() {
    try {
      // Skip validation in test environment
      if (process.env.NODE_ENV === 'test') {
        this.logger.log('Skipping migration validation in test environment');
        return;
      }

      this.logger.log('Validating database migrations...');

      // Get the migrator from MikroORM
      const migrator = this.orm.getMigrator();

      // Check for pending migrations
      const pendingMigrations = await migrator.getPendingMigrations();

      if (pendingMigrations.length > 0) {
        const migrationNames = pendingMigrations.map((m) => m.name).join(', ');
        this.logger.error(
          `Database schema is out of sync! Pending migrations: ${migrationNames}`,
        );
        this.logger.error(
          'Please run migrations before starting the application: npm run migration:up',
        );

        // In production, we should exit the application if migrations are pending
        if (process.env.NODE_ENV === 'production') {
          this.logger.error(
            'Exiting application due to pending migrations in production environment',
          );
          process.exit(1);
        } else {
          this.logger.warn(
            'Application started with pending migrations in development environment',
          );
        }
      } else {
        this.logger.log('Database schema is up to date');
      }
    } catch (error) {
      this.logger.error('Failed to validate migrations', error);

      // In production, we should exit the application if migration validation fails
      if (process.env.NODE_ENV === 'production') {
        this.logger.error(
          'Exiting application due to migration validation failure in production environment',
        );
        process.exit(1);
      }
    }
  }
}
