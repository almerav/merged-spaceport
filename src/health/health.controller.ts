import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async check() {
    const dbHealth = await this.databaseService.healthCheck();

    return {
      status: dbHealth ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: dbHealth ? 'up' : 'down',
        },
      },
    };
  }

  @Get('database')
  async databaseHealth() {
    const dbHealth = await this.databaseService.healthCheck();
    const stats = dbHealth
      ? await this.databaseService.getConnectionStats()
      : null;

    return {
      status: dbHealth ? 'up' : 'down',
      timestamp: new Date().toISOString(),
      stats: stats,
    };
  }
}
