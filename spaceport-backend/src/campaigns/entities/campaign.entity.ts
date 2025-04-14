import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { CampaignContent } from './campaign-content.entity';
import { Tag } from '../../tags/entities/tag.entity';

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CampaignType {
  EMAIL = 'email',
  SOCIAL = 'social',
  DISPLAY = 'display',
  SMS = 'sms',
  PUSH = 'push',
  OTHER = 'other',
}

@Entity({ tableName: 'campaigns' })
export class Campaign extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => CampaignStatus)
  status: CampaignStatus = CampaignStatus.DRAFT;

  @Enum(() => CampaignType)
  type: CampaignType;

  @Property({ nullable: true })
  startDate?: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @Property({ default: 0 })
  budget: number = 0;

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => CampaignContent, (content) => content.campaign, {
    orphanRemoval: true,
  })
  contents = new Collection<CampaignContent>(this);

  @ManyToMany(() => Tag, (tag) => tag.campaigns, { owner: true })
  tags = new Collection<Tag>(this);
}
