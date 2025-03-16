import { Module } from '@nestjs/common';
import { MigrationValidatorService } from './migration-validator.service';

@Module({
  providers: [MigrationValidatorService],
  exports: [MigrationValidatorService],
})
export class MigrationModule {}
