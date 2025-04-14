import { Module } from '@nestjs/common';
import { ActiveCampaignService } from './active-campaign.service';
import { ActiveCampaignController } from './active-campaign.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ActiveCampaign } from './entities/active-campaign.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ActiveCampaign])],
  controllers: [ActiveCampaignController],
  providers: [ActiveCampaignService],
})
export class ActiveCampaignModule {}
