import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { TagsModule } from './tags/tags.module';
import { TargetsModule } from './targets/targets.module';
import { PerformanceModule } from './performance/performance.module';
import { MigrationModule } from './common/services/migration.module';
import mikroOrmConfig from './config/mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';
        const isTest = nodeEnv === 'test';

        return {
          ...mikroOrmConfig,
          clientUrl: configService.get('DATABASE_URL'),
          host: configService.get('DATABASE_HOST', mikroOrmConfig.host),
          port: configService.get('DATABASE_PORT', mikroOrmConfig.port),
          user: configService.get('DATABASE_USER', mikroOrmConfig.user),
          password: configService.get(
            'DATABASE_PASSWORD',
            mikroOrmConfig.password,
          ),
          dbName: configService.get(
            'DATABASE_NAME',
            isTest ? 'spaceport_test' : 'spaceport',
          ),
          autoLoadEntities: true,
          debug:
            configService.get('DATABASE_DEBUG') === 'true' && !isProduction,

          // Override migrations path for NestJS integration
          migrations: {
            ...mikroOrmConfig.migrations,
            path: 'dist/migrations',
            pathTs: 'src/migrations',
          },

          // Override seeder path for NestJS integration
          seeder: {
            ...mikroOrmConfig.seeder,
            path: 'dist/seeders',
            pathTs: 'src/seeders',
          },
        };
      },
    }),
    UsersModule,
    CampaignsModule,
    TagsModule,
    TargetsModule,
    PerformanceModule,
    MigrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
