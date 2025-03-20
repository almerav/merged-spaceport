import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import {
  configureDatabaseEventListeners,
  getConnectionRetryConfig,
} from '../../config/mikro-orm.config';

/**
 * DatabaseService handles database connection lifecycle and monitoring
 * It implements OnModuleInit and OnModuleDestroy to properly initialize and clean up database connections
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly orm: MikroORM) {}

  /**
   * Initialize database connection when the module is initialized
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing database connection...');

    // Configure event listeners for database connection monitoring
    configureDatabaseEventListeners(this.orm);

    // Verify database connection with retry logic
    await this.verifyConnection();

    this.logger.log('Database connection initialized successfully');
  }

  /**
   * Close database connection when the module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing database connection...');

    try {
      await this.orm.close();
      this.logger.log('Database connection closed successfully');
    } catch (error) {
      this.logger.error('Error closing database connection', error);
      throw error;
    }
  }

  /**
   * Verify database connection with retry logic
   */
  private async verifyConnection(): Promise<void> {
    let isConnected = false;
    let retries = 0;
    const retryConfig = getConnectionRetryConfig();
    const maxRetries = retryConfig.maxRetries;
    const retryDelay = retryConfig.retryDelay;

    while (!isConnected && retries < maxRetries) {
      try {
        await this.orm.em.getConnection().execute('SELECT 1');
        isConnected = true;
        this.logger.log('Database connection verified successfully');
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          this.logger.error(
            `Failed to connect to the database after ${maxRetries} attempts`,
            error,
          );
          throw error;
        }
        this.logger.warn(
          `Failed to connect to the database. Retrying (${retries}/${maxRetries}) in ${retryDelay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  /**
   * Get the MikroORM instance
   */
  getOrmInstance(): MikroORM {
    return this.orm;
  }

  /**
   * Execute a health check query to verify database connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.orm.em.getConnection().execute('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  /**
   * Get database connection statistics
   */
  async getConnectionStats(): Promise<any> {
    try {
      const connection = this.orm.em.getConnection();
      const poolStats = await connection.execute(
        'SELECT * FROM pg_stat_activity WHERE application_name = $1',
        ['spaceport-api'],
      );

      return {
        activeConnections: poolStats.length,
        driverName: this.orm.config.getDriver().constructor.name,
        isConnected: connection.isConnected(),
      };
    } catch (error) {
      this.logger.error('Failed to get connection statistics', error);
      return {
        error: 'Failed to get connection statistics',
        isConnected: false,
      };
    }
  }
}
