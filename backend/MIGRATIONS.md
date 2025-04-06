# Database Migration Guide

This guide provides comprehensive instructions for working with database migrations in the Spaceport backend application.

## Table of Contents

1. [Introduction](#introduction)
2. [Migration Workflow](#migration-workflow)
3. [Creating Migrations](#creating-migrations)
4. [Applying Migrations](#applying-migrations)
5. [Rolling Back Migrations](#rolling-back-migrations)
6. [Validating Migrations](#validating-migrations)
7. [Pre-commit Hooks](#pre-commit-hooks)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Introduction

Database migrations are a way to manage changes to your database schema over time. They allow you to:

- Track changes to your database schema
- Apply changes consistently across different environments
- Roll back changes if needed
- Collaborate with other developers on database changes

This project uses MikroORM's migration system to manage database schema changes.

## Migration Workflow

The typical workflow for working with migrations is:

1. Make changes to your entity classes
2. Generate a migration file based on those changes
3. Review the generated migration file
4. Apply the migration to your database
5. Commit the migration file to version control

## Creating Migrations

There are two ways to create migrations:

### 1. Automatically Generate Migrations

To automatically generate a migration based on the difference between your entity classes and the current database schema:

```bash
npm run migration:generate
```

This will:

- Compare your entity classes with the current database schema
- Generate a migration file with the necessary SQL to update the schema
- Save the migration file in the `src/migrations` directory

### 2. Manually Create Migrations

To create an empty migration file that you can fill in manually:

```bash
npm run migration:create -- --name=YourMigrationName
```

This will create a new migration file in the `src/migrations` directory with empty `up()` and `down()` methods that you can fill in with your own SQL.

## Applying Migrations

To apply pending migrations to your database:

```bash
npm run migration:up
```

This will apply all pending migrations in the order they were created.

To check which migrations are pending:

```bash
npm run migration:pending
```

## Rolling Back Migrations

To roll back the most recently applied migration:

```bash
npm run migration:down
```

To roll back multiple migrations:

```bash
npm run migration:down -- --to=MigrationName
```

## Validating Migrations

To validate your migrations:

```bash
npm run migration:validate
```

This will:

- Check that all migration files have both `up()` and `down()` methods
- Verify that the `down()` methods are properly implemented
- Ensure that migrations are reversible

## Pre-commit Hooks

This project includes a pre-commit hook that checks for entity changes that require migrations. If changes are detected, you'll be prompted to generate a migration before committing.

To skip the pre-commit hook (not recommended):

```bash
git commit --no-verify
```

## Best Practices

### 1. Always Review Generated Migrations

Always review the SQL in generated migrations before applying them. MikroORM does a good job of generating the correct SQL, but it's always good to double-check.

### 2. Test Migrations

Test migrations in a development environment before applying them to production.

### 3. Make Migrations Reversible

Always implement the `down()` method in your migrations to make them reversible. This allows you to roll back changes if needed.

### 4. Keep Migrations Small

Keep migrations small and focused on a single change. This makes them easier to review and less likely to cause problems.

### 5. Use Descriptive Names

Use descriptive names for your migrations to make it clear what they do.

### 6. Include Migrations in Version Control

Always include migration files in version control so that other developers can apply the same changes to their databases.

### 7. Don't Modify Existing Migrations

Once a migration has been applied and committed to version control, don't modify it. Instead, create a new migration to make additional changes.

## Troubleshooting

### Migration Fails to Apply

If a migration fails to apply, you can:

1. Fix the issue in the migration file
2. Run `npm run migration:up` again

### Entity Changes Not Detected

If your entity changes are not being detected:

1. Make sure you've saved all your files
2. Check that your entity classes are properly decorated with MikroORM decorators
3. Try running `npm run schema:update -- --dump` to see the current schema

### Pre-commit Hook Fails

If the pre-commit hook fails:

1. Run `npm run migration:check` to see what changes are needed
2. Generate a migration with `npm run migration:generate`
3. Try committing again

### Database Out of Sync

If your database is out of sync with your migrations:

1. Check which migrations have been applied with `mikro-orm migration:list`
2. Compare with the migration files in your `src/migrations` directory
3. Apply missing migrations with `npm run migration:up`

For more complex issues, refer to the [MikroORM documentation](https://mikro-orm.io/docs/migrations).
