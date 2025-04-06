#!/bin/bash

# Exit on error
set -e

# Database configuration
DB_NAME="spaceport"
DB_USER="spaceport_user"
DB_PASSWORD="spaceport_password"

echo "Setting up PostgreSQL database for Spaceport development..."

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
  echo "Error: PostgreSQL is not running. Please start PostgreSQL and try again."
  exit 1
fi

# Create user if it doesn't exist
echo "Creating database user '$DB_USER'..."
psql -d postgres -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
psql -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create database if it doesn't exist
echo "Creating database '$DB_NAME'..."
psql -d postgres -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
psql -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Grant privileges
echo "Granting privileges to user '$DB_USER'..."
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Database setup completed successfully!"
echo ""
echo "To connect to the database, use the following connection details:"
echo "Host: localhost"
echo "Port: 5432"
echo "Database: $DB_NAME"
echo "Username: $DB_USER"
echo "Password: $DB_PASSWORD"
echo ""
echo "Don't forget to update your .env file with these details." 