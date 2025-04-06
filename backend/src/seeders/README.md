# Database Seeders

This directory contains database seeders for the Spaceport backend application. Seeders are used to populate the database with test data for development and testing purposes.

## Running Seeders

To run all seeders, use the following command:

```bash
npm run db:seed
```

This will execute the `DatabaseSeeder` class, which orchestrates all other seeders in the correct order.

## Seeder Structure

The seeding mechanism is built with the following components:

### BaseSeeder

The `BaseSeeder` class (`BaseSeeder.ts`) provides common functionality for all seeders:

- Environment detection to prevent running in production
- Idempotent seeding (checking if data already exists before insertion)
- Logging utilities
- Helper methods for common seeding operations

### DatabaseSeeder

The `DatabaseSeeder` class (`DatabaseSeeder.ts`) is the entry point for all seeders. It:

- Prevents running in production environments
- Orchestrates the execution of all other seeders in the correct order
- Logs the seeding process

### Entity Seeders

Individual entity seeders create test data for specific entities:

- `UserSeeder`: Creates test user accounts with various roles
- `TagSeeder`: Creates tags for categorizing campaigns
- `CampaignSeeder`: Creates sample marketing campaigns
- `TargetSeeder`: Creates targeting criteria for campaigns
- `PerformanceSeeder`: Creates performance metrics for campaigns

## Creating New Seeders

To create a new seeder:

1. Create a new file in the `src/seeders` directory named `YourEntitySeeder.ts`
2. Extend the `BaseSeeder` class
3. Implement the `run` method
4. Make your seeder idempotent by checking if data already exists
5. Add your seeder to the `DatabaseSeeder` class

Example:

```typescript
import { EntityManager } from '@mikro-orm/core';
import { BaseSeeder } from './BaseSeeder';
import { YourEntity } from '../your-module/entities/your-entity.entity';

export class YourEntitySeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    // Prevent running in production
    this.checkEnvironment();

    this.logStart('YourEntity');

    const items = [
      {
        name: 'Item 1',
        description: 'Description for item 1',
      },
      {
        name: 'Item 2',
        description: 'Description for item 2',
      },
    ];

    let createdCount = 0;

    for (const itemData of items) {
      // Check if item already exists to make seeder idempotent
      const exists = await this.exists(em, YourEntity, { name: itemData.name });

      if (!exists) {
        em.create(YourEntity, itemData);
        createdCount++;
      } else {
        this.logger.verbose(
          `Item with name ${itemData.name} already exists, skipping`,
        );
      }
    }

    this.logComplete('YourEntity', createdCount);
  }
}
```

## Best Practices

1. **Make seeders idempotent**: Always check if data already exists before insertion to avoid duplicates.
2. **Respect dependencies**: Ensure that seeders are executed in the correct order (e.g., users before campaigns).
3. **Use realistic data**: Create test data that resembles real-world scenarios.
4. **Add variety**: Include edge cases and different scenarios in your test data.
5. **Keep it maintainable**: Document your seeders and keep them organized.
6. **Never run in production**: Always include environment checks to prevent accidental execution in production.

## Environment Detection

Seeders include environment detection to prevent running in production. This is implemented in the `BaseSeeder` class:

```typescript
protected checkEnvironment(allowInProduction = false): void {
  if (this.isProduction() && !allowInProduction) {
    this.logger.error('Seeding is not allowed in production environment');
    throw new Error('Seeding is not allowed in production environment');
  }
}
```

By default, all seeders will throw an error if executed in a production environment.
