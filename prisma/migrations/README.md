# Prisma Migrations

This folder contains Prisma migrations for the **public schema only**. The `auth` schema is managed by Supabase and should not be modified.

## Migration History

### `0_init` - Baseline Migration
- **Date**: January 11, 2026
- **Type**: Initial baseline
- **Status**: Applied (marked as baseline, not executed)
- **Description**: Represents the current state of all tables in the `public` schema including the latest field additions

## How to Create New Migrations

### For Development
```bash
# Create and apply a new migration
npx prisma migrate dev --name descriptive_name

# Example:
npx prisma migrate dev --name add_user_preferences
```

### For Production
```bash
# Deploy pending migrations
npx prisma migrate deploy
```

## Important Notes

⚠️ **Auth Schema Warning**
- The `auth` schema is managed by Supabase
- Prisma migrations will detect it but won't modify it
- Always use `npx prisma migrate dev` (not `reset`) to avoid touching auth tables

✅ **Best Practices**
1. Always review generated migrations before applying
2. Test migrations in development first
3. Keep migration names descriptive
4. Commit migrations to version control
5. Never edit applied migrations

## Troubleshooting

### If you see drift warnings about auth schema:
This is expected. Prisma detects the auth schema but won't modify it. You can safely ignore warnings about auth tables.

### To check migration status:
```bash
npx prisma migrate status
```

### If migrations get out of sync:
```bash
# Mark a migration as applied without running it
npx prisma migrate resolve --applied migration_name

# Mark a migration as rolled back
npx prisma migrate resolve --rolled-back migration_name
```

## Migration Workflow

1. **Update Prisma Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: Run `npx prisma migrate dev --name change_description`
3. **Review SQL**: Check the generated migration file
4. **Test**: Verify the changes work as expected
5. **Commit**: Add migration files to git
6. **Deploy**: Run `npx prisma migrate deploy` in production
