# MCP Server Configuration for ApplyMint AI

This VS Code workspace includes MCP (Model Context Protocol) server configurations for connecting to Supabase and PostgreSQL databases.

## MCP Servers

### 1. Supabase MCP Server
- **Purpose**: Provides access to Supabase project management, database operations, and development tools
- **Access Token**: Already configured
- **Tools Available**:
  - Account management
  - Database operations
  - Debugging tools
  - Development utilities
  - Documentation access
  - Functions management
  - Branching operations

### 2. ApplyMint Postgres MCP Server
- **Purpose**: Direct PostgreSQL database access for the ApplyMint application
- **Connection**: Supabase PostgreSQL database
- **Tools Available**:
  - Query execution
  - Schema inspection
  - Table operations
  - View management
  - Function access
  - Index information
  - Constraint details

## Setup Instructions

### For ApplyMint Postgres Server

1. **Get your Supabase database password**:
   - Go to your Supabase dashboard
   - Navigate to Settings > Database
   - Copy the database password (not the anon key)

2. **Update the connection string** in `.vscode/settings.json`:
   ```json
   "POSTGRES_CONNECTION_STRING": "postgresql://postgres:[YOUR-ACTUAL-DB-PASSWORD]@db.pidjubyaqzoitmbixzbf.supabase.co:5432/postgres?sslmode=require"
   ```
   Replace `[YOUR-ACTUAL-DB-PASSWORD]` with your real database password.

3. **Security Note**: Never commit the actual password to version control. Consider using environment variables or VS Code's secret storage.

## Usage

These MCP servers enable AI assistants (like GitHub Copilot) to:
- Query the ApplyMint database directly
- Access Supabase project information
- Perform database operations and analysis
- Generate database-related code and queries

## Environment Variables

You can also use environment variables in the connection string:
```json
"POSTGRES_CONNECTION_STRING": "postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.pidjubyaqzoitmbixzbf.supabase.co:5432/postgres?sslmode=require"
```

Then set the environment variable in your system or VS Code settings.