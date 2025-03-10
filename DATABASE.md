# Database Configuration with MikroORM

This project uses MikroORM for database connectivity and ORM functionality. Below are instructions on how to set up and use the database configuration.

## Setup

1. Copy the `.env.example` file to `.env` and update the database connection details:

```bash
cp .env.example .env
```

2. Update the database connection details in the `.env` file:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=spaceport
```

## Database Commands

The following commands are available for database management:

```bash
# Create a new migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migrations
npm run migration:down

# Update database schema based on entities
npm run schema:update

# Drop all tables and recreate schema
npm run schema:fresh
```

## Entity Example

Here's an example of how to create an entity:

```typescript
import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity({ tableName: 'your_table_name' })
export class YourEntity {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  @Unique()
  uniqueField: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
```

## Using Entities in Modules

To use entities in your modules, import the MikroOrmModule and register your entities:

```typescript
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { YourEntity } from './entities/your-entity.entity';

@Module({
  imports: [MikroOrmModule.forFeature([YourEntity])],
  exports: [MikroOrmModule.forFeature([YourEntity])],
})
export class YourModule {}
```

## Using Repositories in Services

To use repositories in your services:

```typescript
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { YourEntity } from './entities/your-entity.entity';

@Injectable()
export class YourService {
  constructor(
    @InjectRepository(YourEntity)
    private readonly yourEntityRepository: EntityRepository<YourEntity>,
  ) {}

  async findAll(): Promise<YourEntity[]> {
    return this.yourEntityRepository.findAll();
  }

  async findOne(id: string): Promise<YourEntity | null> {
    return this.yourEntityRepository.findOne({ id });
  }

  async create(data: Partial<YourEntity>): Promise<YourEntity> {
    const entity = this.yourEntityRepository.create(data);
    await this.yourEntityRepository.persistAndFlush(entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<YourEntity>,
  ): Promise<YourEntity | null> {
    const entity = await this.yourEntityRepository.findOne({ id });
    if (!entity) {
      return null;
    }

    this.yourEntityRepository.assign(entity, data);
    await this.yourEntityRepository.flush();
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    const entity = await this.yourEntityRepository.findOne({ id });
    if (!entity) {
      return false;
    }

    await this.yourEntityRepository.removeAndFlush(entity);
    return true;
  }
}
```
