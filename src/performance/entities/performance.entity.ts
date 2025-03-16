import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';

@Entity({ tableName: 'performances' })
export class Performance extends BaseEntity {
  @Property()
  date: Date;

  @Property({ default: 0 })
  impressions: number = 0;

  @Property({ default: 0 })
  clicks: number = 0;

  @Property({ default: 0 })
  conversions: number = 0;

  @Property({ default: 0 })
  spend: number = 0;

  @Property({ default: 0 })
  revenue: number = 0;

  @Property({ nullable: true, type: 'json' })
  additionalMetrics?: Record<string, any>;

  @ManyToOne(() => Campaign)
  campaign: Campaign;
}
