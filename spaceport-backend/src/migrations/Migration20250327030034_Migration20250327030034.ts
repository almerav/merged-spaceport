import { Migration } from '@mikro-orm/migrations';

export class Migration20250327030034_Migration20250327030034 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE "users" DROP COLUMN IF EXISTS "deleted_at";`);
    this.addSql(`ALTER TABLE "users" DROP COLUMN IF EXISTS "is_deleted";`);
    this.addSql(
      `ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstname";`,
    );
    this.addSql(`ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastname";`);
    this.addSql(
      `ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdat";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMP NULL;`);
    this.addSql(
      `ALTER TABLE "users" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;`,
    );
    this.addSql(
      `ALTER TABLE "users" RENAME COLUMN "firstname" TO "first_name";`,
    );
    this.addSql(`ALTER TABLE "users" RENAME COLUMN "lastname" TO "last_name";`);
    this.addSql(
      `ALTER TABLE "users" RENAME COLUMN "createdat" TO "created_at";`,
    );
  }
}
