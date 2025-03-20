import { defineConfig, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import { EventArgs } from '@mikro-orm/core';

const logger = new Logger('MikroORM');

/**
 * Environment detection with more granular environment types
 */
export enum Environment {
  DEVELOPMENT = 'development',
  TEST = 'test',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

/**
 * Get the current environment with enhanced detection
 */
export const getEnvironment = (): Environment => {
  const nodeEnv = process.env.NODE_ENV || Environment.DEVELOPMENT;

  switch (nodeEnv.toLowerCase()) {
    case Environment.PRODUCTION:
      return Environment.PRODUCTION;
    case Environment.STAGING:
      return Environment.STAGING;
    case Environment.TEST:
      return Environment.TEST;
    default:
      return Environment.DEVELOPMENT;
  }
};

/**
 * Validates required environment variables based on environment
 */
const validateEnvVariables = () => {
  const environment = getEnvironment();
  const requiredVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ];

  // Only enforce in production and staging environments
  if (
    environment === Environment.PRODUCTION ||
    environment === Environment.STAGING
  ) {
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

// Get current environment
const environment = getEnvironment();
const isProduction = environment === Environment.PRODUCTION;
const isStaging = environment === Environment.STAGING;
const isTest = environment === Environment.TEST;

/**
 * Get environment-specific connection pool settings
 */
const getConnectionPoolSettings = () => {
  switch (environment) {
    case Environment.PRODUCTION:
      return {
        min: parseInt(process.env.DATABASE_POOL_MIN || '5', 10),
        max: parseInt(process.env.DATABASE_POOL_MAX || '20', 10),
        idleTimeoutMillis: parseInt(
          process.env.DATABASE_POOL_IDLE_TIMEOUT || '30000',
          10,
        ),
        acquireTimeoutMillis: parseInt(
          process.env.DATABASE_POOL_ACQUIRE_TIMEOUT || '20000',
          10,
        ),
      };
    case Environment.STAGING:
      return {
        min: 3,
        max: 10,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 20000,
      };
    case Environment.TEST:
      return {
        min: 1,
        max: 3,
        idleTimeoutMillis: 5000,
        acquireTimeoutMillis: 5000,
      };
    default: // Development
      return {
        min: 1,
        max: 5,
        idleTimeoutMillis: 10000,
        acquireTimeoutMillis: 10000,
      };
  }
};

/**
 * Get environment-specific driver options
 */
const getDriverOptions = () => {
  // Base options for all environments
  const baseOptions = {
    connection: {
      application_name: 'spaceport-api',
      keepAlive: true,
    },
  };

  // Production and staging use SSL if configured
  if (isProduction || isStaging) {
    return {
      connection: {
        ...baseOptions.connection,
        ssl:
          process.env.DATABASE_SSL === 'true'
            ? {
                rejectUnauthorized:
                  process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
              }
            : false,
        // Additional production-specific settings
        statement_timeout: parseInt(
          process.env.DATABASE_STATEMENT_TIMEOUT || '30000',
          10,
        ),
        query_timeout: parseInt(
          process.env.DATABASE_QUERY_TIMEOUT || '30000',
          10,
        ),
      },
    };
  }

  return baseOptions;
};

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
  logger: (message) => logger.log(message),

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

  // Enhanced connection pool settings - environment-specific
  pool: getConnectionPoolSettings(),

  // Disable strict mode in development for easier debugging
  strict: isProduction || isStaging,

  // Additional environment-specific settings
  allowGlobalContext: !isProduction,
  forceUtcTimezone: true,

  // Optimized driver options for each environment
  driverOptions: getDriverOptions(),

  // Query timeout settings
  findOneOrFailHandler: (entityName) => {
    return new Error(`Entity ${entityName} not found`);
  },
});

export default MikroOrmConfig;

/**
 * Helper function to configure event listeners for database connection monitoring
 * This should be called after MikroORM is initialized in the application
 * @param orm The MikroORM instance
 */
export const configureDatabaseEventListeners = (orm: any): void => {
  // Register event handlers directly in the ORM config
  orm.config.set('subscribers', [
    {
      getSubscribedEvents() {
        return [
          'connection.connected',
          'connection.failed',
          'connection.closed',
          'query',
          'query.error',
        ];
      },
      'connection.connected'() {
        logger.log('Database connection established');
      },
      'connection.failed'(error: Error) {
        logger.error('Database connection failed', error);
      },
      'connection.closed'() {
        logger.log('Database connection closed');
      },
      query(event: any) {
        if (!isProduction && process.env.DATABASE_LOG_QUERIES === 'true') {
          logger.debug(`Query executed: ${event.query} [took ${event.took}ms]`);
        }
      },
      'query.error'(event: any) {
        if (!isProduction) {
          logger.error(`Query error: ${event.error} in query: ${event.query}`);
        }
      },
    },
  ]);
};

/**
 * Retry configuration for database connection
 * These values are used in the application bootstrap process
 */
export const getConnectionRetryConfig = () => {
  return {
    maxRetries: isProduction ? 5 : 3,
    retryDelay: parseInt(process.env.DATABASE_RETRY_DELAY || '2000', 10), // 2 seconds
  };
};
