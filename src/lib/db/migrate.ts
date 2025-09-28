// Migration utilities for Drizzle ORM
// This file provides utilities for running migrations and managing database schema

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Create a migration client (separate from the main connection pool)
export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for migrations');
  }

  // Create a dedicated migration client
  const migrationClient = postgres(connectionString, {
    max: 1, // Use only 1 connection for migrations
  });

  const db = drizzle(migrationClient);

  try {
    console.log('Starting database migrations...');
    
    await migrate(db, { 
      migrationsFolder: './src/lib/db/migrations',
    });
    
    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await migrationClient.end();
  }
}

// Utility to check if database is ready
export async function checkDatabaseConnection(): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    return false;
  }

  const client = postgres(connectionString, {
    max: 1,
    connect_timeout: 5,
  });

  try {
    await client`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  } finally {
    await client.end();
  }
}

// Manual migration runner (can be called from a script)
if (require.main === module) {
  runMigrations().catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
}