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
  Platform,
} from '../entities/active-campaign.entity';


export class CreateActiveCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ActiveCampaignStatus)
  status?: ActiveCampaignStatus;  

  @IsEnum(ActiveCampaignType)
  type: ActiveCampaignType;

  @IsOptional()
  @IsEnum(Platform) // ✅ Add this
  platform?: Platform;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  
}
