import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../../config/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';

        return {
          ...mikroOrmConfig,
          driver: PostgreSqlDriver,
          host: configService.get('DATABASE_HOST', 'localhost'),
          port: configService.get('DATABASE_PORT', 5432),
          user: configService.get('DATABASE_USER', 'postgres'),
          password: configService.get('DATABASE_PASSWORD', 'postgres'),
          dbName: configService.get('DATABASE_NAME', 'spaceport'),
          autoLoadEntities: true,
          debug: !isProduction,

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
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
