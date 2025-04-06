import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../config/mikro-orm.config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

/**
 * Verifies the database configuration and setup
 */
async function verifyDatabaseSetup() {
  console.log('🔍 Verifying database configuration and setup...');
  console.log('Environment:', process.env.NODE_ENV || 'development');

  // Step 1: Verify environment variables
  verifyEnvironmentVariables();

  // Step 2: Verify configuration files
  verifyConfigurationFiles();

  // Step 3: Test database connection
  await testDatabaseConnection();

  // Step 4: Verify user permissions
  await verifyUserPermissions();

  // Step 5: Verify migration
  await verifyMigration();

  console.log('\n✅ Database verification completed successfully!');
  console.log(
    'You can now run the following commands to set up your database:',
  );
  console.log('  npm run migration:up    - Run migrations');
  console.log('  npm run db:seed         - Seed the database with sample data');
}

/**
 * Verifies that all required environment variables are present
 */
function verifyEnvironmentVariables() {
  console.log('\n📋 Verifying environment variables...');

  const requiredVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      '❌ Missing required environment variables:',
      missingVars.join(', '),
    );
    console.error(
      'Please check your .env file and ensure all required variables are set.',
    );
    process.exit(1);
  }

  console.log('✅ All required environment variables are present.');

  // Validate values
  const dbPort = parseInt(process.env.DATABASE_PORT || '', 10);
  if (isNaN(dbPort) || dbPort <= 0 || dbPort > 65535) {
    console.error(
      '❌ Invalid DATABASE_PORT value. Must be a number between 1 and 65535.',
    );
    process.exit(1);
  }

  console.log('✅ Environment variable values are valid.');
}

/**
 * Verifies that configuration files exist and are valid
 */
function verifyConfigurationFiles() {
  console.log('\n📋 Verifying configuration files...');

  // Check .env.example
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ .env.example file not found.');
    process.exit(1);
  }
  console.log('✅ .env.example file exists.');

  // Check mikro-orm.config.ts
  const configPath = path.resolve(
    process.cwd(),
    'src/config/mikro-orm.config.ts',
  );
  if (!fs.existsSync(configPath)) {
    console.error('❌ src/config/mikro-orm.config.ts file not found.');
    process.exit(1);
  }
  console.log('✅ mikro-orm.config.ts file exists.');

  // Verify config has required properties
  if (!config.host || !config.port || !config.user || !config.dbName) {
    console.error('❌ mikro-orm.config.ts is missing required properties.');
    process.exit(1);
  }
  console.log('✅ mikro-orm.config.ts contains required properties.');
}

/**
 * Tests the database connection
 */
async function testDatabaseConnection() {
  console.log('\n📋 Testing database connection...');

  // Display connection information
  console.log('\n📊 Connection parameters:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Database: ${config.dbName}`);
  console.log(`  User: ${config.user}`);
  console.log(
    `  SSL: ${config.driverOptions?.connection?.ssl ? 'Enabled' : 'Disabled'}`,
  );

  let orm: MikroORM<PostgreSqlDriver>;

  try {
    console.log('\n⏳ Initializing MikroORM...');

    // Initialize MikroORM with our configuration
    orm = await MikroORM.init({
      ...config,
      driver: PostgreSqlDriver,
    });

    console.log('✅ MikroORM initialized successfully');

    // Get the connection
    const connection = orm.em.getConnection();
    console.log('\n⏳ Testing database connection...');

    // Test the connection
    const isConnected = await connection.isConnected();

    if (isConnected) {
      console.log('✅ Database connection successful!');
      console.log(
        `Connected to: ${config.dbName} at ${config.host}:${config.port}`,
      );

      try {
        // Get PostgreSQL version
        const result = await connection.execute('SELECT version()');
        console.log(`\n📌 PostgreSQL version: ${result[0].version}`);

        // Get connection pool information
        const poolInfo = await connection.execute(
          'SELECT count(*) as total_connections FROM pg_stat_activity WHERE datname = $1',
          [config.dbName],
        );
        console.log(`\n📊 Connection pool information:`);
        console.log(
          `  Total active connections: ${poolInfo[0].total_connections}`,
        );
        console.log(
          `  Pool configuration: min=${config.pool?.min}, max=${config.pool?.max}`,
        );

        // Check database size
        const dbSize = await connection.execute(
          'SELECT pg_size_pretty(pg_database_size($1)) as db_size',
          [config.dbName],
        );
        console.log(`  Database size: ${dbSize[0].db_size}`);
      } catch (error) {
        console.warn(
          '⚠️ Could not retrieve all database information:',
          error.message,
        );
      }
    } else {
      console.error('❌ Failed to connect to the database.');
      process.exit(1);
    }

    // Close the connection
    await orm.close(true);
    console.log('\n👋 Connection closed successfully');

    return orm;
  } catch (error) {
    console.error('\n❌ Error connecting to the database:');

    if (error.code === 'ECONNREFUSED') {
      console.error(
        `  Connection refused: The database server at ${config.host}:${config.port} is not accepting connections.`,
      );
      console.error('  Possible causes:');
      console.error('   - Database server is not running');
      console.error('   - Firewall is blocking the connection');
      console.error('   - Incorrect host or port');
    } else if (error.code === 'ETIMEDOUT') {
      console.error(
        `  Connection timed out: Could not connect to ${config.host}:${config.port} within the timeout period.`,
      );
    } else if (error.code === 'ENOTFOUND') {
      console.error(
        `  Host not found: The host '${config.host}' could not be resolved.`,
      );
    } else if (error.message.includes('authentication')) {
      console.error('  Authentication failed: Invalid username or password.');
    } else if (error.message.includes('does not exist')) {
      console.error(`  Database '${config.dbName}' does not exist.`);
      console.error('  You may need to create the database first.');
    } else {
      console.error(`  ${error.message}`);
    }

    console.error('\n📋 Full error details:');
    console.error(error);

    process.exit(1);
  }
}

/**
 * Verifies user permissions by attempting various database operations
 */
async function verifyUserPermissions() {
  console.log('\n📋 Verifying user permissions...');

  let orm: MikroORM<PostgreSqlDriver>;

  try {
    // Initialize MikroORM
    orm = await MikroORM.init({
      ...config,
      driver: PostgreSqlDriver,
    });

    const connection = orm.em.getConnection();

    // Test CREATE TABLE permission
    console.log('⏳ Testing CREATE TABLE permission...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS permission_test (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
    console.log('✅ CREATE TABLE permission verified');

    // Test INSERT permission
    console.log('⏳ Testing INSERT permission...');
    await connection.execute(`
      INSERT INTO permission_test (name) VALUES ('test')
    `);
    console.log('✅ INSERT permission verified');

    // Test SELECT permission
    console.log('⏳ Testing SELECT permission...');
    await connection.execute(`
      SELECT * FROM permission_test
    `);
    console.log('✅ SELECT permission verified');

    // Test UPDATE permission
    console.log('⏳ Testing UPDATE permission...');
    await connection.execute(`
      UPDATE permission_test SET name = 'updated' WHERE name = 'test'
    `);
    console.log('✅ UPDATE permission verified');

    // Test DELETE permission
    console.log('⏳ Testing DELETE permission...');
    await connection.execute(`
      DELETE FROM permission_test WHERE name = 'updated'
    `);
    console.log('✅ DELETE permission verified');

    // Test DROP TABLE permission
    console.log('⏳ Testing DROP TABLE permission...');
    await connection.execute(`
      DROP TABLE permission_test
    `);
    console.log('✅ DROP TABLE permission verified');

    console.log('✅ All database permissions verified successfully');

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('❌ Error verifying user permissions:', error.message);
    console.error('Please ensure the database user has sufficient privileges.');
    process.exit(1);
  }
}

/**
 * Verifies that the migration can be run successfully
 */
async function verifyMigration() {
  console.log('\n📋 Verifying migration...');

  // Check if migration file exists
  const migrationPath = path.resolve(
    process.cwd(),
    'src/migrations/Migration20240314000000.ts',
  );
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }
  console.log('✅ Migration file exists');

  // We won't actually run the migration here, as that should be done
  // with the proper migration command. Instead, we'll just verify the file.
  console.log(
    '✅ Migration file verified. To run migrations, use: npm run migration:up',
  );
}

// Run the verification
verifyDatabaseSetup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
