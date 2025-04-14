import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { Campaign } from './campaign.entity';

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  HTML = 'html',
  DOCUMENT = 'document',
}

@Entity({ tableName: 'campaign_contents' })
export class CampaignContent extends BaseEntity {
  @Property()
  title: string;

  @Property({ nullable: true, type: 'text' })
  content?: string;

  @Property({ nullable: true })
  mediaUrl?: string;

  @Enum(() => ContentType)
  contentType: ContentType;

  @Property({ default: 0 })
  displayOrder: number = 0;

  @ManyToOne(() => Campaign)
  campaign: Campaign;
}
