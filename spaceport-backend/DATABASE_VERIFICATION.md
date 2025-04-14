# PostgreSQL Database Verification Guide

This guide provides instructions for verifying the PostgreSQL database setup for the Spaceport backend.

## Prerequisites

Before proceeding with the verification, ensure you have:

1. PostgreSQL installed and running on your machine
2. Node.js and npm installed
3. Project dependencies installed (`npm install`)
4. A `.env` file created from `.env.example` with your database credentials

## Verification Steps

### 1. Run the Verification Script

We've created a comprehensive verification script that checks all aspects of the database setup:

```bash
npm run db:verify-setup
```

This script will:

- Verify environment variables
- Check configuration files
- Test database connection
- Verify user permissions
- Check migration files

### 2. Manual Verification (if needed)

If you prefer to verify each component manually, follow these steps:

#### Test Database Connection

```bash
npm run db:test-connection
```

#### Check Pending Migrations

```bash
npm run migration:pending
```

#### Run Migrations

```bash
npm run migration:up
```

#### Seed the Database

```bash
npm run db:seed
```

### 3. Verify Entity Manager

To verify that the EntityManager is working correctly:

```bash
# Start the NestJS REPL
npm run repl

# In the REPL, get the EntityManager
const em = app.get('MikroORM').em;

# Test a simple query
await em.getConnection().execute('SELECT 1');

# Try to find entities
await em.find(User, {});
```

### 4. Verify Transactions

To verify that transactions are working correctly:

```bash
# In the NestJS REPL
const em = app.get('MikroORM').em.fork();

# Start a transaction
await em.begin();

# Perform some operations
const user = em.create(User, {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'password123'
});
em.persist(user);

# Commit the transaction
await em.commit();

# Verify the user was created
const foundUser = await em.findOne(User, { email: 'test@example.com' });
console.log(foundUser);

# Clean up (start another transaction)
await em.begin();
await em.nativeDelete(User, { email: 'test@example.com' });
await em.commit();
```

### 5. Verify Domain-Based Architecture

To verify that the domain-based architecture is working correctly:

```bash
# In the NestJS REPL
const usersModule = app.select(UsersModule);
const userRepo = usersModule.get(getRepositoryToken(User));

# Test repository methods
const users = await userRepo.findAll();
console.log(users);
```

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

   - Create the database manually using PostgreSQL commands:
     ```sql
     CREATE DATABASE spaceport;
     ```

4. **Migration failures**:
   - Check for syntax errors in migration files
   - Ensure database user has sufficient privileges

### Advanced Troubleshooting

#### Connection Pool Issues

If you're experiencing connection pool issues:

1. **Check pool configuration**:

   ```bash
   # In the NestJS REPL
   const config = app.get('MikroORM').config;
   console.log(config.get('pool'));
   ```

2. **Monitor active connections**:

   ```sql
   SELECT * FROM pg_stat_activity WHERE datname = 'spaceport';
   ```

3. **Reset connection pool**:
   ```bash
   # In the NestJS REPL
   const orm = app.get('MikroORM');
   await orm.em.getConnection().close();
   await orm.em.getConnection().connect();
   ```

#### Transaction Issues

If you're experiencing transaction issues:

1. **Check transaction isolation level**:

   ```sql
   SHOW transaction_isolation;
   ```

2. **Check for locks**:

   ```sql
   SELECT * FROM pg_locks l JOIN pg_stat_activity a ON l.pid = a.pid;
   ```

3. **Kill hanging transactions**:
   ```sql
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity
   WHERE datname = 'spaceport' AND state = 'idle in transaction';
   ```

#### Entity Manager Issues

If you're experiencing EntityManager issues:

1. **Check if EntityManager is properly initialized**:

   ```bash
   # In the NestJS REPL
   const em = app.get('MikroORM').em;
   console.log(em.isInTransaction());
   console.log(em.getConnection().isConnected());
   ```

2. **Clear identity map if entities are stale**:

   ```bash
   # In the NestJS REPL
   const em = app.get('MikroORM').em;
   em.clear();
   ```

3. **Check for circular references**:
   ```bash
   # In the NestJS REPL
   const em = app.get('MikroORM').em;
   const user = await em.findOne(User, {}, { populate: ['campaigns'] });
   console.log(JSON.stringify(user, null, 2));
   ```

## Database Health Checks

The application includes built-in health checks for the database. You can access them via:

```bash
# Start the application
npm run start:dev

# Access the health endpoint
curl http://localhost:3000/health
```

The health endpoint will return:

```json
{
  "status": "ok",
  "details": {
    "database": {
      "status": "up",
      "responseTime": 5,
      "connection": {
        "activeConnections": 2,
        "driverName": "PostgreSqlDriver",
        "isConnected": true
      }
    }
  }
}
```

## Verification Checklist

Use this checklist to ensure all aspects of the database setup have been verified:

- [ ] Environment variables are correctly set in `.env`
- [ ] Database connection is successful
- [ ] Database user has all required permissions
- [ ] Migration files are valid and can be run
- [ ] Seeder works correctly and populates the database
- [ ] Application can connect to the database and perform operations
- [ ] Entity Manager can perform CRUD operations
- [ ] Transactions work correctly
- [ ] Domain-based architecture is functioning properly
- [ ] Repository pattern is working as expected
- [ ] Entity lifecycle hooks are triggered appropriately

## Database Performance Verification

To verify database performance:

1. **Check query execution time**:

   ```bash
   # Set DATABASE_LOG_QUERIES=true in .env
   # Start the application and observe query logs
   ```

2. **Check for slow queries**:

   ```sql
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   ```

3. **Verify indexes are being used**:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
   ```

## Next Steps

After successful verification:

1. Run the application: `npm run start:dev`
2. Access the API endpoints to ensure they can interact with the database
3. Review the enhanced documentation in `DATABASE.md` for more details on working with the database

## Support

If you encounter any issues during the verification process, please:

1. Check the troubleshooting section above
2. Review the logs for specific error messages
3. Consult the PostgreSQL documentation for your specific version
4. Contact the development team for assistance
