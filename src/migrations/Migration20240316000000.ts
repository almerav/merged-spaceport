import { Migration } from '@mikro-orm/migrations';

export class Migration20240316000000 extends Migration {
  async up(): Promise<void> {
    // Update users table to add missing fields
    this.addSql(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "deleted_at" timestamptz NULL,
      ADD COLUMN IF NOT EXISTS "is_deleted" boolean NOT NULL DEFAULT false;
    `);

    // Create campaigns table
    this.addSql(`
      CREATE TABLE "campaigns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "description" varchar(255) NULL,
        "status" varchar(255) NOT NULL DEFAULT 'draft',
        "type" varchar(255) NOT NULL,
        "start_date" timestamptz NULL,
        "end_date" timestamptz NULL,
        "budget" numeric NOT NULL DEFAULT 0,
        "owner_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "campaigns_owner_id_foreign" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE
      );
    `);

    // Create campaign_contents table
    this.addSql(`
      CREATE TABLE "campaign_contents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "content" text NULL,
        "media_url" varchar(255) NULL,
        "content_type" varchar(255) NOT NULL,
        "display_order" integer NOT NULL DEFAULT 0,
        "campaign_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "campaign_contents_campaign_id_foreign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE
      );
    `);

    // Create tags table
    this.addSql(`
      CREATE TABLE "tags" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "description" varchar(255) NULL,
        "color" varchar(255) NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "tags_name_unique" UNIQUE ("name")
      );
    `);

    // Create campaigns_tags table (for many-to-many relationship)
    this.addSql(`
      CREATE TABLE "campaigns_tags" (
        "campaign_id" uuid NOT NULL,
        "tag_id" uuid NOT NULL,
        CONSTRAINT "campaigns_tags_pkey" PRIMARY KEY ("campaign_id", "tag_id"),
        CONSTRAINT "campaigns_tags_campaign_id_foreign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE,
        CONSTRAINT "campaigns_tags_tag_id_foreign" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE
      );
    `);

    // Create targets table
    this.addSql(`
      CREATE TABLE "targets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "description" varchar(255) NULL,
        "type" varchar(255) NOT NULL,
        "criteria" jsonb NOT NULL,
        "campaign_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "targets_campaign_id_foreign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE
      );
    `);

    // Create performances table
    this.addSql(`
      CREATE TABLE "performances" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "date" timestamptz NOT NULL,
        "impressions" integer NOT NULL DEFAULT 0,
        "clicks" integer NOT NULL DEFAULT 0,
        "conversions" integer NOT NULL DEFAULT 0,
        "spend" numeric NOT NULL DEFAULT 0,
        "revenue" numeric NOT NULL DEFAULT 0,
        "additional_metrics" jsonb NULL,
        "campaign_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "performances_campaign_id_foreign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE
      );
    `);

    // Add indexes for better performance
    this.addSql(
      'CREATE INDEX "campaigns_owner_id_index" ON "campaigns" ("owner_id");',
    );
    this.addSql(
      'CREATE INDEX "campaigns_status_index" ON "campaigns" ("status");',
    );
    this.addSql('CREATE INDEX "campaigns_type_index" ON "campaigns" ("type");');
    this.addSql(
      'CREATE INDEX "campaign_contents_campaign_id_index" ON "campaign_contents" ("campaign_id");',
    );
    this.addSql(
      'CREATE INDEX "campaigns_tags_campaign_id_index" ON "campaigns_tags" ("campaign_id");',
    );
    this.addSql(
      'CREATE INDEX "campaigns_tags_tag_id_index" ON "campaigns_tags" ("tag_id");',
    );
    this.addSql(
      'CREATE INDEX "targets_campaign_id_index" ON "targets" ("campaign_id");',
    );
    this.addSql(
      'CREATE INDEX "performances_campaign_id_index" ON "performances" ("campaign_id");',
    );
    this.addSql(
      'CREATE INDEX "performances_date_index" ON "performances" ("date");',
    );
  }

  async down(): Promise<void> {
    // Drop tables in reverse order to avoid foreign key constraints
    this.addSql('DROP TABLE IF EXISTS "performances";');
    this.addSql('DROP TABLE IF EXISTS "targets";');
    this.addSql('DROP TABLE IF EXISTS "campaigns_tags";');
    this.addSql('DROP TABLE IF EXISTS "tags";');
    this.addSql('DROP TABLE IF EXISTS "campaign_contents";');
    this.addSql('DROP TABLE IF EXISTS "campaigns";');

    // Revert changes to users table
    this.addSql(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "deleted_at",
      DROP COLUMN IF EXISTS "is_deleted";
    `);
  }
}
