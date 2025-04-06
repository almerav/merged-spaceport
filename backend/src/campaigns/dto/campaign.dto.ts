// src/campaigns/dto/campaign.dto.ts
import { CampaignStatus, CampaignType } from '../entities/campaign.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsEnum(CampaignType)
  type: CampaignType;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsNumber()
  budget: number;

  @IsNumber()
  owner: number;
}

export class UpdateCampaignDto extends CreateCampaignDto {}
