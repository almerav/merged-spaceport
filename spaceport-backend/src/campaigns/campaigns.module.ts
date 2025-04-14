// src/campaigns/campaigns.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Campaign } from './entities/campaign.entity';
import { CampaignContent } from './entities/campaign-content.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Campaign, CampaignContent])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
