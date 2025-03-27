import {
  Entity,
  Property,
  PrimaryKey,
  Unique,
  BeforeCreate,
} from '@mikro-orm/core';
import { hash } from 'bcrypt';

@Entity({ tableName: 'users' }) // Ensure table name matches
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ unique: true })
  @Unique()
  email!: string;

  @Property({ fieldName: 'firstname' }) 
  firstName!: string;

  @Property({ fieldName: 'lastname' }) 
  lastName!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ fieldName: 'createdat', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  @BeforeCreate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
