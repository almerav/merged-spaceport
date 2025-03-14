import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../config/mikro-orm.config';
import * as dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

/**
 * Tests database connection with detailed reporting and error handling
 */
async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Environment:', process.env.NODE_ENV || 'development');

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

// Run the test
testConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
