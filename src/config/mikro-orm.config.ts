import { defineConfig, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as path from 'path';

const logger = new Logger('MikroORM');

/**
 * Validates required environment variables in production
 */
const validateEnvVariables = () => {
  const requiredVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ];

  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';

  if (isProduction) {
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }
  }
};

// Validate environment variables
validateEnvVariables();

// Load environment variables
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isTest = nodeEnv === 'test';

/**
 * MikroORM Configuration
 */
const MikroOrmConfig: Options<PostgreSqlDriver> = defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  dbName:
    process.env.DATABASE_NAME || (isTest ? 'spaceport_test' : 'spaceport'),

  // Entity discovery - using domain-based structure
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  // Debugging and logging
  debug: !isProduction && process.env.DATABASE_DEBUG === 'true',
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
    safe: !isProduction, // Safe mode in non-production environments
  },

  // Seeder configuration
  seeder: {
    path: path.join(__dirname, '../seeders'),
    pathTs: path.join(__dirname, '../seeders'),
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
  },

  // Connection pool settings - environment-specific
  pool: {
    min: isProduction ? 2 : 1,
    max: isProduction ? 10 : 5,
    idleTimeoutMillis: isProduction ? 30000 : 10000,
    acquireTimeoutMillis: isProduction ? 20000 : 10000,
  },

  // Retry logic is handled in the application bootstrap
  // instead of here due to MikroORM limitations

  // Disable strict mode in development for easier debugging
  strict: isProduction,

  // Additional environment-specific settings
  allowGlobalContext: !isProduction,
  forceUtcTimezone: true,

  // Optimized for production
  driverOptions: isProduction
    ? {
        connection: {
          ssl:
            process.env.DATABASE_SSL === 'true'
              ? { rejectUnauthorized: false }
              : false,
          application_name: 'spaceport-api',
          keepAlive: true,
        },
      }
    : undefined,
});

export default MikroOrmConfig;
