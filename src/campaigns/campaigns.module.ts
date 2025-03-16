import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Campaign } from './entities/campaign.entity';
import { CampaignContent } from './entities/campaign-content.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Campaign, CampaignContent])],
  exports: [MikroOrmModule.forFeature([Campaign, CampaignContent])],
})
export class CampaignsModule {}
