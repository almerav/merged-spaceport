import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../config/mikro-orm.config';
import * as dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

/**
 * Tests migrations by applying them and then rolling them back
 */
async function testMigrations() {
  console.log('🔍 Testing migrations...');
  console.log('Environment:', process.env.NODE_ENV || 'development');

  // Warn if running in production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ This script should not be run in production!');
    process.exit(1);
  }

  let orm: MikroORM<PostgreSqlDriver>;

  try {
    // Initialize MikroORM
    orm = await MikroORM.init({
      ...config,
      driver: PostgreSqlDriver,
    });

    // Get the migrator
    const migrator = orm.getMigrator();

    // Get pending migrations
    const pendingMigrations = await migrator.getPendingMigrations();

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations to test');
      await orm.close(true);
      return;
    }

    console.log(
      `\n📋 Found ${pendingMigrations.length} pending migrations to test`,
    );

    for (const migration of pendingMigrations) {
      console.log(`\n⏳ Testing migration: ${migration.name}`);

      try {
        // Apply the migration
        console.log(`Applying migration ${migration.name}...`);
        await migrator.up(migration.name);
        console.log(`✅ Migration ${migration.name} applied successfully`);

        // Roll back the migration
        console.log(`Rolling back migration ${migration.name}...`);
        await migrator.down(migration.name);
        console.log(`✅ Migration ${migration.name} rolled back successfully`);

        console.log(`✅ Migration ${migration.name} passed the test`);
      } catch (error) {
        console.error(`❌ Migration ${migration.name} failed the test:`);
        console.error(error);

        // Try to roll back the migration if it was applied
        try {
          console.log(`Attempting to roll back migration ${migration.name}...`);
          await migrator.down(migration.name);
          console.log(
            `✅ Migration ${migration.name} rolled back successfully`,
          );
        } catch (rollbackError) {
          console.error(`❌ Failed to roll back migration ${migration.name}:`);
          console.error(rollbackError);
        }

        // Exit with error
        await orm.close(true);
        process.exit(1);
      }
    }

    console.log('\n✅ All migrations passed the test');

    // Close the connection
    await orm.close(true);
    console.log('\n👋 Connection closed successfully');
  } catch (error) {
    console.error('\n❌ Error testing migrations:');
    console.error(error);
    process.exit(1);
  }
}

// Run the function
testMigrations().catch((error) => {
  console.error('Failed to test migrations:', error);
  process.exit(1);
});
