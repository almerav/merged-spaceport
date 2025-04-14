import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';

@Entity({ tableName: 'tags' })
export class Tag extends BaseEntity {
  @Property()
  @Unique()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  color?: string;

  @ManyToMany(() => Campaign, (campaign) => campaign.tags)
  campaigns = new Collection<Campaign>(this);
}
