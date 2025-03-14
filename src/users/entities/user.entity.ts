import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  @Unique()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property({ default: false })
  isDeleted: boolean = false;
}
