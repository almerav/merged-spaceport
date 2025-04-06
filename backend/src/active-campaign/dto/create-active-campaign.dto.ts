import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ActiveCampaignStatus,
  ActiveCampaignType,
} from '../entities/active-campaign.entity';

export class CreateActiveCampaignDto {
  @IsString()
  name: string;

  @IsEnum(ActiveCampaignStatus)
  status: ActiveCampaignStatus;

  @IsEnum(ActiveCampaignType)
  type: ActiveCampaignType;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date; // Accepts ISO date string (e.g., "2025-04-01T00:00:00.000Z")

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date; // Accepts ISO date string
}
