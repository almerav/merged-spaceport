import { Migration } from '@mikro-orm/migrations';

export class Migration20250324080717_Migration20250324080717 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`select 1`);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }
}
