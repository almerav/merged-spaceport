import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Tag])],
  exports: [MikroOrmModule.forFeature([Tag])],
})
export class TagsModule {}
