import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../config/mikro-orm.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

/**
 * Generates a migration for entity changes
 */
async function generateMigration() {
  console.log('🔍 Generating migration for entity changes...');
  console.log('Environment:', process.env.NODE_ENV || 'development');

  let orm: MikroORM<PostgreSqlDriver>;

  try {
    // Initialize MikroORM
    orm = await MikroORM.init({
      ...config,
      driver: PostgreSqlDriver,
    });

    // Get the migrator
    const migrator = orm.getMigrator();

    // Check for pending migrations first
    const pendingMigrations = await migrator.getPendingMigrations();
    if (pendingMigrations.length > 0) {
      console.warn(
        '⚠️ There are pending migrations that have not been applied:',
      );
      pendingMigrations.forEach((migration) => {
        console.warn(`  - ${migration.name}`);
      });
      console.warn(
        'You should apply these migrations before generating a new one.',
      );
      console.warn('Run: npm run migration:up');
    }

    // Generate a migration with a timestamp-based name
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .substring(0, 14);
    const migrationName = `Migration${timestamp}`;

    console.log(`\n⏳ Generating migration: ${migrationName}...`);

    // Generate the migration
    const migration = await migrator.createMigration(
      path.join(process.cwd(), 'src/migrations'),
      true, // Update schema dump
      false, // Generate if no changes
      migrationName,
    );

    if (migration) {
      console.log(`✅ Migration generated successfully: ${migration.fileName}`);
      console.log(
        `Migration file: ${path.join(process.cwd(), 'src/migrations', migration.fileName)}`,
      );

      // Check if there were actual changes
      if (migration.diff.up.length === 0 && migration.diff.down.length === 0) {
        console.log(
          'ℹ️ No schema changes detected. Empty migration file generated.',
        );
      } else {
        console.log('ℹ️ Schema changes detected and migration file generated.');
      }
    } else {
      console.log(
        'ℹ️ No schema changes detected. No migration file generated.',
      );
    }

    // Close the connection
    await orm.close(true);
    console.log('\n👋 Connection closed successfully');
  } catch (error) {
    console.error('\n❌ Error generating migration:');
    console.error(error);
    process.exit(1);
  }
}

// Run the function
generateMigration().catch((error) => {
  console.error('Failed to generate migration:', error);
  process.exit(1);
});
