import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Target } from './entities/target.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Target])],
  exports: [MikroOrmModule.forFeature([Target])],
})
export class TargetsModule {}
