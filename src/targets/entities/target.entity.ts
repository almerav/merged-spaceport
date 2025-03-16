import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';

export enum TargetType {
  DEMOGRAPHIC = 'demographic',
  GEOGRAPHIC = 'geographic',
  BEHAVIORAL = 'behavioral',
  INTEREST = 'interest',
  CUSTOM = 'custom',
}

@Entity({ tableName: 'targets' })
export class Target extends BaseEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => TargetType)
  type: TargetType;

  @Property({ type: 'json' })
  criteria: Record<string, any>;

  @ManyToOne(() => Campaign)
  campaign: Campaign;
}
