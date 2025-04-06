import { Migration } from '@mikro-orm/migrations';

export class Migration20250319003527_Migration20250319003527 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`select 1`);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
