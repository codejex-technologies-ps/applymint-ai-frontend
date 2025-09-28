import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema/*',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Use Supabase PostgreSQL connection string
    // The connection string should be in format: postgresql://[user]:[password]@[host]:[port]/[database]
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});