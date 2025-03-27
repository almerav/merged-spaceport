import { Migration } from '@mikro-orm/migrations';

export class Migration20250326064300_Migration20250326064300 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "active_campaigns" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "status" VARCHAR(255) NOT NULL,
        "type" VARCHAR(255) NOT NULL,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "budget" FLOAT NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "is_deleted" BOOLEAN DEFAULT false
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "active_campaigns";`);
  }
}
