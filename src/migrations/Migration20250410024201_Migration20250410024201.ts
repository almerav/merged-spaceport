import { Migration } from '@mikro-orm/migrations';

export class Migration20250410024201 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "active_campaigns" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
        "name" VARCHAR(255) NOT NULL,
        "status" VARCHAR(255) NOT NULL CHECK ("status" IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
        "type" VARCHAR(255) NOT NULL CHECK ("type" IN ('email', 'social', 'display', 'sms', 'push', 'other')),
        "start_date" TIMESTAMP NULL,
        "end_date" TIMESTAMP NULL,
        "budget" NUMERIC(10, 2) NOT NULL DEFAULT 0,
        "image_url" VARCHAR(255) NULL,
        "video_url" VARCHAR(255) NULL,
        "platform" VARCHAR(255) NULL CHECK ("platform" IN ('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'other'))
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "active_campaigns";');
  }
}
