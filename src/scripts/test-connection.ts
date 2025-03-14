import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../config/mikro-orm.config';

async function testConnection() {
  console.log('Testing database connection...');

  try {
    // Initialize MikroORM with our configuration
    const orm = await MikroORM.init({
      ...config,
      driver: PostgreSqlDriver,
    });

    // Get the connection
    const connection = orm.em.getConnection();

    // Test the connection
    const isConnected = await connection.isConnected();

    if (isConnected) {
      console.log('✅ Database connection successful!');
      console.log(
        `Connected to: ${config.dbName} at ${config.host}:${config.port}`,
      );

      // Get PostgreSQL version
      const result = await connection.execute('SELECT version()');
      console.log(`PostgreSQL version: ${result[0].version}`);
    } else {
      console.error('❌ Failed to connect to the database.');
    }

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
