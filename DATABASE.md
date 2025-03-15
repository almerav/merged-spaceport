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

### Transactions

For operations that require transactional integrity:

```typescript
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class TransactionalService {
  constructor(private readonly em: EntityManager) {}

  async performTransactionalOperation() {
    const em = this.em.fork();

    try {
      await em.begin();

      // Perform multiple operations
      const entity1 = em.create(Entity1, data1);
      const entity2 = em.create(Entity2, data2);

      await em.persistAndFlush([entity1, entity2]);
      await em.commit();

      return { entity1, entity2 };
    } catch (error) {
      await em.rollback();
      throw error;
    }
  }
}
```
