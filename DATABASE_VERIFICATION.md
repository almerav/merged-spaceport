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

## Verification Checklist

Use this checklist to ensure all aspects of the database setup have been verified:

- [ ] Environment variables are correctly set in `.env`
- [ ] Database connection is successful
- [ ] Database user has all required permissions
- [ ] Migration files are valid and can be run
- [ ] Seeder works correctly and populates the database
- [ ] Application can connect to the database and perform operations

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
