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
 * Validates migrations to ensure they are reversible and consistent
 */
async function validateMigrations() {
  console.log('🔍 Validating migrations...');
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

    // Get all migrations
    const migrations = await migrator.getExecutedMigrations();
    console.log(`\n📋 Found ${migrations.length} executed migrations`);

    // Check for pending migrations
    const pendingMigrations = await migrator.getPendingMigrations();
    if (pendingMigrations.length > 0) {
      console.warn(
        `\n⚠️ There are ${pendingMigrations.length} pending migrations that have not been applied:`,
      );
      pendingMigrations.forEach((migration) => {
        console.warn(`  - ${migration.name}`);
      });
    } else {
      console.log('\n✅ All migrations have been applied');
    }

    // Validate migration files
    console.log('\n📋 Validating migration files...');
    const migrationsDir = path.join(process.cwd(), 'src/migrations');

    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Migrations directory not found: ${migrationsDir}`);
      process.exit(1);
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(
        (file) => file.match(/^Migration.*\.ts$/) && !file.endsWith('.d.ts'),
      );

    if (migrationFiles.length === 0) {
      console.warn('⚠️ No migration files found');
    } else {
      console.log(`Found ${migrationFiles.length} migration files`);

      // Validate each migration file
      let hasErrors = false;

      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        console.log(`\n📋 Validating migration: ${file}`);

        // Check if migration has both up and down methods
        const hasUpMethod = content.includes('async up()');
        const hasDownMethod = content.includes('async down()');

        if (!hasUpMethod) {
          console.error(`❌ Migration ${file} is missing the 'up' method`);
          hasErrors = true;
        } else {
          console.log('✅ Has up method');
        }

        if (!hasDownMethod) {
          console.error(`❌ Migration ${file} is missing the 'down' method`);
          hasErrors = true;
        } else {
          console.log('✅ Has down method');
        }

        // Check if down method is properly implemented (not empty)
        if (hasDownMethod) {
          const downMethodEmpty =
            content.includes('async down(): Promise<void> {}') ||
            content.includes('async down(): Promise<void> {\n  }') ||
            content.includes('async down() {}') ||
            content.includes('async down() {\n  }');

          if (downMethodEmpty) {
            console.warn(`⚠️ Migration ${file} has an empty 'down' method`);
          } else {
            console.log('✅ Down method has implementation');
          }
        }

        // Check for SQL syntax in methods
        const hasSqlInUp = content.includes('this.addSql(');
        const hasSqlInDown = content.includes('this.addSql(') && hasDownMethod;

        if (!hasSqlInUp) {
          console.warn(
            `⚠️ Migration ${file} doesn't use 'this.addSql()' in the 'up' method`,
          );
        }

        if (hasDownMethod && !hasSqlInDown) {
          console.warn(
            `⚠️ Migration ${file} doesn't use 'this.addSql()' in the 'down' method`,
          );
        }
      }

      if (hasErrors) {
        console.error('\n❌ Some migrations have errors that need to be fixed');
      } else {
        console.log('\n✅ All migration files are valid');
      }
    }

    // Close the connection
    await orm.close(true);
    console.log('\n👋 Connection closed successfully');
  } catch (error) {
    console.error('\n❌ Error validating migrations:');
    console.error(error);
    process.exit(1);
  }
}

// Run the function
validateMigrations().catch((error) => {
  console.error('Failed to validate migrations:', error);
  process.exit(1);
});
