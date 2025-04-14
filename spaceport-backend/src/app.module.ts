import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { TagsModule } from './tags/tags.module';
import { TargetsModule } from './targets/targets.module';
import { PerformanceModule } from './performance/performance.module';
import { MigrationModule } from './common/services/migration.module';
import { HealthModule } from './health/health.module';
import mikroOrmConfig from './config/mikro-orm.config';
import { AuthModule } from './auth/auth.module';
import { ActiveCampaignModule } from './active-campaign/active-campaign.module';

import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    HealthModule,
    UsersModule,
    CampaignsModule,
    TagsModule,
    TargetsModule,
    PerformanceModule,
    MigrationModule,
    UsersModule,
    AuthModule,
    ActiveCampaignModule,

    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
