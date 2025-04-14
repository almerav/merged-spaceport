import { Migration } from '@mikro-orm/migrations';

export class Migration20240314000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL,
        "first_name" varchar(255) NOT NULL,
        "last_name" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "avatar" varchar(255) NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE ("email")
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "users";');
    this.addSql('DROP EXTENSION IF EXISTS "uuid-ossp";');
  }
}
