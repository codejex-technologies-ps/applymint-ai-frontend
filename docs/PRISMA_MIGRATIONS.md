# Prisma Migrations Quick Reference

## ✅ Migrations Now Enabled!

Your Prisma migrations are now properly configured with a baseline migration (`0_init`).

---

## 🚀 Common Commands

### Creating Migrations

```bash
# Create and apply a migration (dev environment)
npx prisma migrate dev --name add_new_field

# Create migration without applying (review first)
npx prisma migrate dev --create-only --name add_new_field

# Apply pending migrations (production)
npx prisma migrate deploy
```

### Checking Status

```bash
# Check migration status
npx prisma migrate status

# View migration history
ls -la prisma/migrations/
```

### Managing Migrations

```bash
# Mark migration as applied (without running)
npx prisma migrate resolve --applied migration_name

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back migration_name

# Reset database and reapply all migrations (⚠️ DESTRUCTIVE)
# DO NOT USE with Supabase - will break auth schema
# npx prisma migrate reset
```

---

## 📋 Workflow Example

### 1. Make Schema Changes
Edit `prisma/schema.prisma`:
```prisma
model profiles {
  // ... existing fields
  new_field String?  // Add your new field
}
```

### 2. Create Migration
```bash
npx prisma migrate dev --name add_new_field_to_profiles
```

This will:
- Generate migration SQL in `prisma/migrations/[timestamp]_add_new_field_to_profiles/`
- Apply it to your database
- Regenerate Prisma Client

### 3. Review Migration
Check the generated SQL file:
```bash
cat prisma/migrations/[timestamp]_add_new_field_to_profiles/migration.sql
```

### 4. Commit
```bash
git add prisma/migrations/
git add prisma/schema.prisma
git commit -m "feat: add new_field to profiles"
```

### 5. Deploy to Production
```bash
npx prisma migrate deploy
```

---

## ⚠️ Important: Auth Schema Handling

**The `auth` schema is managed by Supabase, NOT Prisma.**

When you create migrations, you may see warnings about the auth schema. This is **NORMAL** and **SAFE**. Prisma will:
- ✅ Generate migrations for `public` schema changes
- ✅ Detect auth schema (for relationships)
- ❌ NOT modify auth schema tables

**Safe Commands:**
- `npx prisma migrate dev` ✅
- `npx prisma migrate deploy` ✅  
- `npx prisma migrate status` ✅
- `npx prisma db push` ✅

**DANGEROUS Commands:**
- `npx prisma migrate reset` ⛔ (Don't use - will try to drop auth schema)
- `npx prisma db pull` ⚠️ (Will overwrite schema.prisma)

---

## 🎯 Current Setup

```
prisma/
├── schema.prisma                    # Your schema definition
└── migrations/
    ├── README.md                    # This guide
    ├── migration_lock.toml          # Migration system config
    └── 0_init/                      # Baseline migration
        └── migration.sql            # Initial schema state
```

**Migration Status**: ✅ Database is up to date  
**Last Migration**: `0_init` (baseline)

---

## 📚 Resources

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Baseline Existing Database](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/baselining)
- [Troubleshooting Guide](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-development)

---

## 💡 Tips

1. **Always backup before production migrations**
2. **Review generated SQL before applying**
3. **Test migrations in development first**
4. **Keep migration names descriptive**
5. **Commit migrations to version control immediately**
6. **Use `--create-only` to review before applying**

---

**You're all set! 🎉**

Try it out:
```bash
# Check status
npx prisma migrate status

# Make a schema change and create migration
npx prisma migrate dev --name test_migration
```
