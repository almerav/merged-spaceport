import { Injectable, Logger } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly orm: MikroORM) {}

  /**
   * Check database health by executing a simple query
   */
  async checkDatabase(): Promise<boolean> {
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
  async getDatabaseStats(): Promise<any> {
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
