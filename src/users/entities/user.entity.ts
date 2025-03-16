import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property()
  @Unique()
  email: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ hidden: true })
  password: string;

  @Property({ nullable: true })
  avatar?: string;
}
