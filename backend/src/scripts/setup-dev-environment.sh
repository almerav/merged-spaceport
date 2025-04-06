#!/bin/bash

# Exit on error
set -e

echo "Setting up Spaceport development environment..."

# Check if .env file exists, if not create it from .env.example
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo ".env file created. Please update it with your database credentials if needed."
else
  echo ".env file already exists."
fi

# Run database setup script
echo "Setting up database..."
bash src/scripts/setup-database.sh

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed."
fi

# Build the project
echo "Building the project..."
npm run build

# Run migrations
echo "Running database migrations..."
npm run migration:up

# Seed the database
echo "Seeding the database with sample data..."
npx mikro-orm seeder:run

echo "Development environment setup completed successfully!"
echo "You can now start the application with: npm run start:dev" 