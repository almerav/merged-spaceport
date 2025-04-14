import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    const dbHealth = await this.healthService.checkDatabase();

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
    const dbHealth = await this.healthService.checkDatabase();
    const stats = dbHealth ? await this.healthService.getDatabaseStats() : null;

    return {
      status: dbHealth ? 'up' : 'down',
      timestamp: new Date().toISOString(),
      stats: stats,
    };
  }
}
