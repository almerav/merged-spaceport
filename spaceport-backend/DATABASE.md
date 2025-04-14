# Database Configuration with MikroORM

This project uses MikroORM for database connectivity and ORM functionality. Below are comprehensive instructions on how to set up and use the database configuration.

## Local PostgreSQL Setup

### Prerequisites

- PostgreSQL 13+ installed locally
- Basic knowledge of PostgreSQL commands
- Node.js 16+ and npm installed

### Installation Steps

1. **Install PostgreSQL** (if not already installed):

   - **macOS**: `brew install postgresql` or download from [PostgreSQL website](https://www.postgresql.org/download/macosx/)
   - **Windows**: Download installer from [PostgreSQL website](https://www.postgresql.org/download/windows/)
   - **Linux**: `sudo apt install postgresql postgresql-contrib` (Ubuntu/Debian) or equivalent for your distribution

2. **Start PostgreSQL service**:

   - **macOS**: `brew services start postgresql`
   - **Windows**: PostgreSQL is installed as a service and should start automatically
   - **Linux**: `sudo systemctl start postgresql`

3. **Create the database**:

   ```bash
   # Login to PostgreSQL
   sudo -u postgres psql

   # Create database and user (if not using default postgres user)
   CREATE DATABASE spaceport;
   CREATE USER spaceport_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE spaceport TO spaceport_user;

   # Exit PostgreSQL
   \q
   ```

4. **Configure environment variables**:
   Copy the `.env.example` file to `.env` and update the database connection details:

   ```bash
   cp .env.example .env
   ```

   Update the database connection details in the `.env` file:

   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres  # or your custom user
   DATABASE_PASSWORD=postgres  # or your custom password
   DATABASE_NAME=spaceport
   DATABASE_SSL=false
   DATABASE_DEBUG=false
   ```

## Environment Variables and Connection Options

The application uses the following environment variables for database configuration:

### Basic Connection Variables

- `DATABASE_HOST`: Database server hostname (default: 'localhost')
- `DATABASE_PORT`: Database server port (default: 5432)
- `DATABASE_USER`: Database username (default: 'postgres')
- `DATABASE_PASSWORD`: Database password (default: 'postgres')
- `DATABASE_NAME`: Database name (default: 'spaceport' or 'spaceport_test' in test environment)
- `DATABASE_SSL`: Enable SSL connection (default: false)
- `DATABASE_DEBUG`: Enable debug logging (default: false)

### Connection Pool Settings

- `DATABASE_POOL_MIN`: Minimum number of connections in pool (default varies by environment)
- `DATABASE_POOL_MAX`: Maximum number of connections in pool (default varies by environment)
- `DATABASE_POOL_IDLE_TIMEOUT`: Connection idle timeout in milliseconds (default varies by environment)
- `DATABASE_POOL_ACQUIRE_TIMEOUT`: Connection acquire timeout in milliseconds (default varies by environment)

### Advanced Settings

- `DATABASE_STATEMENT_TIMEOUT`: Statement timeout in milliseconds (production/staging only)
- `DATABASE_QUERY_TIMEOUT`: Query timeout in milliseconds (production/staging only)
- `DATABASE_SSL_REJECT_UNAUTHORIZED`: Whether to reject unauthorized SSL connections (default: true)
- `DATABASE_LOG_QUERIES`: Enable query logging (development only)

## Verifying Your Setup

To verify your database setup is working correctly:

1. **Test the database connection**:

   ```bash
   npm run db:test-connection
   ```

   This will output detailed information about your connection status.

2. **Run migrations**:

   ```bash
   npm run migration:up
   ```

   This will create all necessary tables in your database.

3. **Seed the database**:
   ```bash
   npm run db:seed
   ```
   This will populate your database with sample data.

## Troubleshooting

### Common Issues

1. **Connection refused errors**:

   - Ensure PostgreSQL service is running
   - Check if the port is correct (default is 5432)
   - Verify firewall settings aren't blocking connections

2. **Authentication failures**:

   - Double-check username and password in `.env`
   - Ensure the user has appropriate permissions

3. **Database doesn't exist**:

   - Create the database manually using `CREATE DATABASE spaceport;`

4. **Migration failures**:
   - Check for syntax errors in migration files
   - Ensure database user has sufficient privileges

### Advanced Troubleshooting

1. **Connection pool exhaustion**:

   - Increase `DATABASE_POOL_MAX` value
   - Check for connection leaks in your code
   - Ensure connections are properly released after use

2. **Slow queries**:

   - Enable query logging with `DATABASE_LOG_QUERIES=true`
   - Check for missing indexes on frequently queried fields
   - Review query execution plans with `EXPLAIN ANALYZE`

3. **Transaction deadlocks**:

   - Review transaction isolation levels
   - Ensure consistent order when accessing multiple entities in transactions
   - Consider using optimistic locking for high-contention scenarios

4. **Entity validation errors**:
   - Verify entity property types match database column types
   - Check for missing or incorrect entity decorators
   - Ensure required properties have default values or are properly initialized

### PostgreSQL Command Line Basics

- **Connect to PostgreSQL**: `psql -U postgres`
- **List databases**: `\l`
- **Connect to a database**: `\c spaceport`
- **List tables**: `\dt`
- **Describe table**: `\d table_name`
- **Exit psql**: `\q`

## Database Commands

The following commands are available for database management:

```bash
# Create a new migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migrations
npm run migration:down

# View pending migrations
npm run migration:pending

# Update database schema based on entities
npm run schema:update

# Drop all tables and recreate schema
npm run schema:fresh

# Seed the database with sample data
npm run db:seed

# Test database connection
npm run db:test-connection
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

## Entity Manager Usage

The EntityManager is the primary interface for working with your database. Here are examples of how to obtain and use it:

### Obtaining the EntityManager

#### 1. Via Constructor Injection

```typescript
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class YourService {
  constructor(private readonly em: EntityManager) {}

  async someMethod() {
    // Use this.em here
  }
}
```

#### 2. Via DatabaseService

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';

@Injectable()
export class YourService {
  constructor(private readonly databaseService: DatabaseService) {}

  async someMethod() {
    const orm = this.databaseService.getOrmInstance();
    const em = orm.em;
    // Use em here
  }
}
```

#### 3. Forking the EntityManager

For isolated operations, especially in transactions, it's recommended to fork the EntityManager:

```typescript
async someMethod() {
  const em = this.em.fork();
  // Use forked em for isolated operations
}
```

### Common EntityManager Operations

```typescript
// Find entities
const entities = await this.em.find(YourEntity, {
  /* criteria */
});

// Find a single entity
const entity = await this.em.findOne(YourEntity, { id });

// Create a new entity
const entity = this.em.create(YourEntity, {
  /* data */
});

// Persist entities (stage for database insert/update)
this.em.persist(entity);

// Flush changes to database
await this.em.flush();

// Combined persist and flush
await this.em.persistAndFlush(entity);

// Remove an entity
this.em.remove(entity);
await this.em.flush();

// Combined remove and flush
await this.em.removeAndFlush(entity);

// Clear the identity map
this.em.clear();
```

## Transaction Management

Transactions ensure that multiple database operations are executed atomically. Here are examples of how to use transactions in the Spaceport application:

### Basic Transaction Example

```typescript
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class TransactionService {
  constructor(private readonly em: EntityManager) {}

  async performTransaction() {
    // Fork the EntityManager to isolate the transaction
    const em = this.em.fork();

    try {
      // Begin transaction
      await em.begin();

      // Perform multiple operations
      const entity1 = em.create(Entity1, {
        /* data */
      });
      const entity2 = em.create(Entity2, {
        /* data */
      });

      em.persist(entity1);
      em.persist(entity2);

      // Commit transaction
      await em.commit();

      return { entity1, entity2 };
    } catch (error) {
      // Rollback transaction on error
      await em.rollback();
      throw error;
    }
  }
}
```

### Using the Transaction Decorator

MikroORM provides a `@UseRequestContext()` decorator that can be used with NestJS to automatically manage transactions:

```typescript
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/nestjs';

@Injectable()
export class YourService {
  constructor(private readonly em: EntityManager) {}

  @UseRequestContext()
  async transactionalMethod() {
    // This method will run in a transaction
    const entity = this.em.create(YourEntity, {
      /* data */
    });
    await this.em.persistAndFlush(entity);
    return entity;
  }
}
```

### Nested Transactions

MikroORM supports nested transactions using savepoints:

```typescript
async nestedTransactionExample() {
  const em = this.em.fork();

  try {
    await em.begin();

    // First operation
    const entity1 = em.create(Entity1, { /* data */ });
    em.persist(entity1);

    try {
      // Begin nested transaction (savepoint)
      await em.begin();

      // Second operation
      const entity2 = em.create(Entity2, { /* data */ });
      em.persist(entity2);

      // Commit nested transaction
      await em.commit();
    } catch (nestedError) {
      // Rollback only the nested transaction
      await em.rollback();
      throw nestedError;
    }

    // Commit outer transaction
    await em.commit();

    return { entity1 };
  } catch (error) {
    // Rollback entire transaction
    await em.rollback();
    throw error;
  }
}
```

## Repository Pattern

The repository pattern is a design pattern that separates the logic that retrieves data from the underlying storage from the business logic. In the Spaceport application, we use MikroORM's EntityRepository to implement this pattern.

### Repository Structure

Each domain in the application has its own repository for managing entities:

```typescript
import { EntityRepository } from '@mikro-orm/postgresql';
import { YourEntity } from './entities/your-entity.entity';

// This is automatically created by MikroORM
export class YourEntityRepository extends EntityRepository<YourEntity> {
  // Custom repository methods can be added here

  async findByCustomCriteria(criteria: any): Promise<YourEntity[]> {
    return this.find({ ...criteria, isDeleted: false });
  }

  async softDelete(id: string): Promise<void> {
    const entity = await this.findOne({ id });
    if (entity) {
      entity.isDeleted = true;
      entity.deletedAt = new Date();
      await this.flush();
    }
  }
}
```

### Registering Custom Repositories

To use custom repositories, register them in your module:

```typescript
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { YourEntity } from './entities/your-entity.entity';
import { YourEntityRepository } from './repositories/your-entity.repository';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [YourEntity],
      repositories: [YourEntityRepository],
    }),
  ],
  exports: [MikroOrmModule.forFeature([YourEntity])],
})
export class YourModule {}
```

### Repository Best Practices

1. **Keep repositories focused**: Each repository should handle operations for a single entity type.
2. **Use query builders for complex queries**: For complex queries, use the QueryBuilder API.
3. **Implement soft delete**: Use the `isDeleted` flag and `deletedAt` timestamp for soft deletion.
4. **Add domain-specific methods**: Extend repositories with methods that encapsulate domain-specific query logic.
5. **Use transactions for multi-entity operations**: When operations span multiple repositories, use transactions.

## Domain-Based Architecture

The Spaceport application follows a domain-based architecture, where each domain handles its own entities and business logic.

### Domain Structure

Each domain typically includes:

- **Entities**: Database models representing domain objects
- **DTOs**: Data Transfer Objects for API requests/responses
- **Services**: Business logic for the domain
- **Controllers**: API endpoints for the domain
- **Modules**: NestJS modules that tie everything together

### Domain Registration

Each domain registers its entities with MikroORM using `MikroOrmModule.forFeature()`:

```typescript
// campaigns.module.ts
@Module({
  imports: [MikroOrmModule.forFeature([Campaign, CampaignContent])],
  exports: [MikroOrmModule.forFeature([Campaign, CampaignContent])],
})
export class CampaignsModule {}

// users.module.ts
@Module({
  imports: [MikroOrmModule.forFeature([User])],
  exports: [MikroOrmModule.forFeature([User])],
})
export class UsersModule {}
```

### Cross-Domain Relationships

Entities can have relationships with entities from other domains. For example, a Campaign has a relationship with a User:

```typescript
@Entity({ tableName: 'campaigns' })
export class Campaign extends BaseEntity {
  // ... other properties

  @ManyToOne(() => User)
  owner: User;

  // ... other relationships
}
```

### Domain Isolation

Each domain should be as isolated as possible, with clear boundaries:

1. **Domain-specific repositories**: Each domain has its own repositories.
2. **Domain-specific services**: Business logic is encapsulated in domain services.
3. **Cross-domain communication**: Domains communicate through well-defined interfaces.
4. **Shared abstractions**: Common functionality is shared through the `common` module.

## Entity Lifecycle Hooks

MikroORM provides lifecycle hooks that allow you to execute code at specific points in an entity's lifecycle.

### Available Lifecycle Hooks

- `@BeforeCreate()`: Executed before an entity is created
- `@AfterCreate()`: Executed after an entity is created
- `@BeforeUpdate()`: Executed before an entity is updated
- `@AfterUpdate()`: Executed after an entity is updated
- `@BeforeDelete()`: Executed before an entity is deleted
- `@AfterDelete()`: Executed after an entity is deleted
- `@OnInit()`: Executed when an entity is initialized from the database
- `@OnLoad()`: Executed when an entity is loaded from the database

### Example: Automatic Timestamps

The BaseEntity class in the Spaceport application uses the `onUpdate` option to automatically update the `updatedAt` timestamp:

```typescript
export abstract class BaseEntity {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // ... other properties
}
```

### Example: Custom Lifecycle Hook

You can implement custom lifecycle hooks in your entities:

```typescript
import { BeforeCreate, BeforeUpdate, Entity } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ tableName: 'your_table' })
export class YourEntity extends BaseEntity {
  // ... properties

  @BeforeCreate()
  beforeCreate() {
    // Logic to execute before entity creation
    this.someField = this.computeSomeValue();
  }

  @BeforeUpdate()
  beforeUpdate() {
    // Logic to execute before entity update
    this.validateState();
  }

  private computeSomeValue() {
    // Custom logic
    return 'computed value';
  }

  private validateState() {
    // Validation logic
    if (!this.requiredField) {
      throw new Error('Required field is missing');
    }
  }
}
```

### Global Event Listeners

The Spaceport application configures global event listeners for database connection events:

```typescript
export const configureDatabaseEventListeners = (orm: any): void => {
  const eventManager = orm.em.getEventManager();

  // Connection lifecycle events
  eventManager.addEventListener('connection.connected', () => {
    logger.log('Database connection established');
  });

  eventManager.addEventListener('connection.failed', (error: Error) => {
    logger.error('Database connection failed', error);
  });

  // ... other event listeners
};
```

## Security Best Practices

The Spaceport application implements several database security best practices:

### Connection Security

1. **SSL Encryption**: Production and staging environments can enable SSL for database connections:

   ```
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=true
   ```

2. **Connection Timeouts**: Prevent hanging connections with timeouts:

   ```
   DATABASE_STATEMENT_TIMEOUT=30000
   DATABASE_QUERY_TIMEOUT=30000
   ```

3. **Environment-Specific Settings**: Different security settings for different environments:
   ```typescript
   // Production settings
   if (isProduction || isStaging) {
     // Stricter security settings
   }
   ```

### Data Protection

1. **Password Hashing**: User passwords are stored as hashed values, never in plaintext:

   ```typescript
   @Property({ hidden: true })
   password: string;
   ```

2. **Hidden Properties**: Sensitive fields are marked as hidden to prevent accidental exposure:

   ```typescript
   @Property({ hidden: true })
   sensitiveData: string;
   ```

3. **Soft Deletion**: Records are soft-deleted rather than permanently removed:

   ```typescript
   @Property({ nullable: true })
   deletedAt?: Date;

   @Property({ default: false })
   isDeleted: boolean = false;
   ```

### Query Security

1. **Parameterized Queries**: MikroORM uses parameterized queries to prevent SQL injection.

2. **Query Timeouts**: Prevent long-running queries that could lead to DoS:

   ```typescript
   statement_timeout: parseInt(process.env.DATABASE_STATEMENT_TIMEOUT || '30000', 10),
   query_timeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '30000', 10),
   ```

3. **Limited Database User Permissions**: Database users should have only the permissions they need.

### Application-Level Security

1. **Input Validation**: Validate all input before using it in database operations.

2. **Rate Limiting**: Implement rate limiting for database-intensive operations.

3. **Audit Logging**: Log all significant database operations for audit purposes.

4. **Environment Variables**: Store database credentials in environment variables, never in code.

5. **Connection Pooling**: Use connection pooling with appropriate limits to prevent resource exhaustion.

## Best Practices

1. **Environment-specific configurations**:

   - Use different database names for development, testing, and production
   - Never use production credentials in development or test environments

2. **Migration management**:

   - Create small, focused migrations
   - Always test migrations on a development database before applying to production
   - Include both up and down methods for reversibility

3. **Performance optimization**:

   - Use appropriate indexes on frequently queried fields
   - Be mindful of N+1 query problems (use `populate()` wisely)
   - Consider using query caching for read-heavy operations

4. **Security considerations**:
   - Use strong, unique passwords for database users
   - Limit database user permissions to only what's necessary
   - Enable SSL for production database connections
   - Never commit `.env` files with real credentials to version control

## Advanced Topics

### Connection Pooling

The application uses connection pooling to efficiently manage database connections. The pool settings can be configured in `src/config/mikro-orm.config.ts`:

```typescript
pool: {
  min: isProduction ? 2 : 1,
  max: isProduction ? 10 : 5,
  idleTimeoutMillis: isProduction ? 30000 : 10000,
  acquireTimeoutMillis: isProduction ? 20000 : 10000,
}
```
