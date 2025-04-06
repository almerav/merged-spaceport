# MikroORM Configuration

This directory contains the configuration for MikroORM, which is used for database connectivity in the application.

## Configuration Files

- `mikro-orm.config.ts`: The main configuration file for MikroORM. This file is used by both the application and the MikroORM CLI.

## Environment Variables

The following environment variables are used for database configuration:

- `DATABASE_HOST`: The hostname of the database server (default: `localhost`)
- `DATABASE_PORT`: The port of the database server (default: `5432`)
- `DATABASE_USER`: The username for the database connection (default: `postgres`)
- `DATABASE_PASSWORD`: The password for the database connection (default: `postgres`)
- `DATABASE_NAME`: The name of the database (default: `spaceport`)
- `NODE_ENV`: The environment in which the application is running (default: `development`)

## Usage

The configuration is automatically loaded by the application when it starts. It is also used by the MikroORM CLI for migrations and schema management.

### In the Application

The configuration is used in the `DatabaseModule` to set up the MikroORM connection:

```typescript
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../../config/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      // Configuration using mikroOrmConfig
    }),
  ],
})
export class DatabaseModule {}
```

### In the CLI

The configuration is used by the MikroORM CLI for migrations and schema management. The CLI commands are defined in the `package.json` file:

```json
{
  "scripts": {
    "migration:create": "mikro-orm migration:create",
    "migration:up": "mikro-orm migration:up",
    "migration:down": "mikro-orm migration:down",
    "schema:update": "mikro-orm schema:update --run",
    "schema:fresh": "mikro-orm schema:fresh --run"
  }
}
```

## Testing the Connection

You can test the database connection using the following command:

```bash
npm run db:test-connection
```

This will run a script that attempts to connect to the database and verify the connection.
