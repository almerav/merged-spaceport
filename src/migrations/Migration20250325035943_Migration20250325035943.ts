import { Migration } from '@mikro-orm/migrations';

export class Migration20250325035943_Migration20250325035943 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE active_campaigns 
      ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
    `);
    
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }

}
