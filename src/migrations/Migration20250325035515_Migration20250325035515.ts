import { Migration } from '@mikro-orm/migrations';

export class Migration20250325035515_Migration20250325035515 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE active_campaigns 
      ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
      ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    `);
    
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }

}
