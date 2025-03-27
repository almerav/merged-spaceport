import { Migration } from '@mikro-orm/migrations';

export class Migration20250327030034_Migration20250327030034 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "deleted_at",
      DROP COLUMN IF EXISTS "is_deleted",
      RENAME COLUMN "first_name" TO "firstname",
      RENAME COLUMN "last_name" TO "lastname",
      RENAME COLUMN "created_at" TO "createdat";
      `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE "users"
      ADD COLUMN "deleted_at" TIMESTAMP NULL,
      ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false,
      RENAME COLUMN "firstname" TO "first_name",
      RENAME COLUMN "lastname" TO "last_name",
      RENAME COLUMN "createdat" TO "created_at";
    `);
  }
}
