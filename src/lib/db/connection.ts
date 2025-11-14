import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create a connection string from Supabase environment variables
function createConnectionString(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL environment variable is required",
    );
  }

  // Extract the project reference from the Supabase URL
  // Format: https://your-project-id.supabase.co
  const projectId = supabaseUrl.replace("https://", "").replace(
    ".supabase.co",
    "",
  );

  // Use DATABASE_URL if provided (for production), otherwise construct from Supabase URL
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return databaseUrl;
  }

  // For development, we'll use the connection string format for Supabase
  // This assumes you have the database password and connection details
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!dbPassword) {
    throw new Error(
      "Either DATABASE_URL or SUPABASE_DB_PASSWORD must be provided for Drizzle ORM",
    );
  }

  return `postgresql://postgres:${dbPassword}@db.${projectId}.supabase.co:5432/postgres`;
}

// Create postgres client with connection pooling
const connectionString = createConnectionString();

// Configure connection with appropriate settings for Supabase
const client = postgres(connectionString, {
  // Connection pool settings
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds

  // SSL configuration for Supabase (production)
  ssl: process.env.NODE_ENV === "production" ? "require" : false,

  // Transform settings for better performance
  transform: {
    undefined: null, // Transform undefined to null for PostgreSQL
  },
});

// Create drizzle instance with schema
export const db = drizzle(client, { schema });

// Export the client for direct access if needed
export { client };

// Helper function to close connections (useful for serverless)
export const closeConnection = async () => {
  await client.end();
};

// Connection health check
export const checkConnection = async (): Promise<boolean> => {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};
