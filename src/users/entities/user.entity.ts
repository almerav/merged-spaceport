import {
  Entity,
  Property,
  PrimaryKey,
  Unique,
  BeforeCreate,
} from '@mikro-orm/core';
import { hash } from 'bcrypt';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  email!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ default: 'user' })
  role!: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @BeforeCreate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
