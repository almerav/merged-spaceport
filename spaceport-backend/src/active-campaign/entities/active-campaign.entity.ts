import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';

export enum ActiveCampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ActiveCampaignType {
  MARKETING = 'marketing',
  ADVERTISING = 'advertising',
  EVENT_PROMOTION = 'event_promotion',
  SALES = 'sales',
  ADVOCACY = 'advocacy',
}

export enum Platform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  OTHER = 'other',
}

@Entity({ tableName: 'active_campaigns' })
export class ActiveCampaign {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string = crypto.randomUUID();

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ default: false })
  isDeleted: boolean = false;

  @Property({ name: 'name' }) // Map it to the database column "name"
  name: string;

  @Enum(() => ActiveCampaignStatus)
  status: ActiveCampaignStatus = ActiveCampaignStatus.DRAFT;  

  @Enum(() => ActiveCampaignType)
  type: ActiveCampaignType;

  @Property({ nullable: true })
  startDate?: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @Property({ default: 0 })
  budget: number = 0;

  @Property({ nullable: true })
  imageUrl?: string;  // URL for the campaign's image

  @Property({ nullable: true })
  videoUrl?: string;  // URL for the campaign's video

  @Enum({ items: () => Platform, nullable: true })
  platform?: Platform;  

  
}
