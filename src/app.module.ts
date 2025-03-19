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
import { DatabaseModule } from './common/services/database.module';
import { HealthModule } from './health/health.module';
import mikroOrmConfig from './config/mikro-orm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    DatabaseModule,
    HealthModule,
    UsersModule,
    CampaignsModule,
    TagsModule,
    TargetsModule,
    PerformanceModule,
    MigrationModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
