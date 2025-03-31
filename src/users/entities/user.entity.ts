import {
  Entity,
  Property,
  PrimaryKey,
  Unique,
  BeforeCreate,
} from '@mikro-orm/core';
import { hash } from 'bcrypt';

// Defines the User entity mapped to the 'users' table
@Entity({ tableName: 'users' })
export class User {
  // Primary key with UUID generated by PostgreSQL
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  // Unique email field
  @Property({ unique: true })
  @Unique()
  email!: string;

  // First name field mapped to 'firstname' column
  @Property({ fieldName: 'firstname' })
  firstName!: string;

  // Last name field mapped to 'lastname' column
  @Property({ fieldName: 'lastname' })
  lastName!: string;

  // Password field, hidden in query results
  @Property({ hidden: true })
  password!: string;

  // Optional avatar URL or path
  @Property({ nullable: true })
  avatar?: string;

  // Timestamp for record creation
  @Property({ fieldName: 'createdat', onCreate: () => new Date() })
  createdAt!: Date;

  // Timestamp for record update, nullable
  @Property({
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt?: Date;

  // Hashes password before creating a new record
  @BeforeCreate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
