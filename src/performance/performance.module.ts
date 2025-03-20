import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Performance } from './entities/performance.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Performance])],
  exports: [MikroOrmModule.forFeature([Performance])],
})
export class PerformanceModule {}
