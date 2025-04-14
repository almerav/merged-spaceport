import { PartialType } from '@nestjs/mapped-types';
import { CreateActiveCampaignDto } from './create-active-campaign.dto';

export class UpdateActiveCampaignDto extends PartialType(
  CreateActiveCampaignDto,
) {}
