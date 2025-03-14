import { defineConfig, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as path from 'path';

const logger = new Logger('MikroORM');

// Load environment variables
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const MikroOrmConfig: Options<PostgreSqlDriver> = defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  dbName: process.env.DATABASE_NAME || 'spaceport',

  // Entity discovery
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  // Debugging and logging
  debug: !isProduction,
  logger: logger.log.bind(logger),

  // Migrations configuration
  migrations: {
    path: path.join(__dirname, '../migrations'),
    pathTs: path.join(__dirname, '../migrations'),
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
  },

  // Seeder configuration
  seeder: {
    path: path.join(__dirname, '../seeders'),
    pathTs: path.join(__dirname, '../seeders'),
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
  },

  // Connection pool settings
  pool: {
    min: isProduction ? 2 : 1,
    max: isProduction ? 10 : 5,
  },

  // Disable strict mode in development for easier debugging
  strict: isProduction,
});

export default MikroOrmConfig;
