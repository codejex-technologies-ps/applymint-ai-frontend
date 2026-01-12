# Prisma ORM Integration Guide

## Overview

ApplyMint AI uses **Prisma ORM** for database operations, providing excellent TypeScript integration, type safety, and developer experience. This guide covers setup, usage, and best practices for working with Prisma in this project.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration](#configuration)
3. [Schema Management](#schema-management)
4. [Using Prisma Client](#using-prisma-client)
5. [Best Practices](#best-practices)
6. [Migrations](#migrations)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PNPM 10+ package manager
- DATABASE_URL environment variable set

### Installation

Prisma is already installed in this project. To work with it:

```bash
# Generate Prisma Client (run after schema changes)
pnpm db:generate

# Open Prisma Studio (GUI for database)
pnpm db:studio

# Push schema changes to database
pnpm db:push

# Create and apply migrations
pnpm db:migrate
```

## Configuration

### Environment Variables

Set up your `.env.local` file:

```bash
# Required: PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@db.yourproject.supabase.co:5432/postgres"

# Or construct from Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_DB_PASSWORD=your_database_password
```

### Prisma Configuration Files

**`prisma/schema.prisma`** - Main schema file defining all database models
**`prisma.config.ts`** - Prisma configuration settings
**`src/lib/prisma.ts`** - Prisma Client singleton instance

## Schema Management

### Schema Structure

The Prisma schema is organized into logical sections:

```prisma
// User profiles and authentication
model Profile { ... }
model UserPreference { ... }

// Companies and jobs
model Company { ... }
model Job { ... }
model JobApplication { ... }

// Resumes and related
model Resume { ... }
model WorkExperience { ... }
model Education { ... }

// Credit system
model CreditPackage { ... }
model CreditTransaction { ... }
```

### Modifying the Schema

1. Edit `prisma/schema.prisma`
2. Run `pnpm db:generate` to update Prisma Client
3. For production: Create a migration with `pnpm db:migrate`
4. For development: Push changes with `pnpm db:push`

Example: Adding a new field

```prisma
model Profile {
  id String @id @db.Uuid
  email String @unique
  
  // Add new field
  avatarUrl String? @map("avatar_url")
  
  createdAt DateTime @default(now()) @map("created_at")
  // ...
}
```

## Using Prisma Client

### Importing the Client

```typescript
import { prisma } from '@/lib/prisma'
```

### Basic CRUD Operations

#### Create

```typescript
// Create a new profile
const profile = await prisma.profile.create({
  data: {
    id: userId,
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    credit: 5,
  },
})
```

#### Read

```typescript
// Find unique record
const profile = await prisma.profile.findUnique({
  where: { id: userId },
})

// Find many with filters
const jobs = await prisma.job.findMany({
  where: {
    isActive: true,
    location: { contains: 'New York' },
  },
  orderBy: { postedAt: 'desc' },
  take: 20,
})

// Include relations
const jobWithCompany = await prisma.job.findUnique({
  where: { id: jobId },
  include: {
    company: true,
  },
})
```

#### Update

```typescript
// Update a record
const updated = await prisma.profile.update({
  where: { id: userId },
  data: {
    firstName: 'Jane',
    updatedAt: new Date(),
  },
})
```

#### Delete

```typescript
// Delete a record
await prisma.profile.delete({
  where: { id: userId },
})

// Soft delete (update status)
await prisma.job.update({
  where: { id: jobId },
  data: { isActive: false },
})
```

### Advanced Queries

#### Filtering and Search

```typescript
// Case-insensitive search
const profiles = await prisma.profile.findMany({
  where: {
    OR: [
      { email: { contains: query, mode: 'insensitive' } },
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
    ],
  },
})

// Date range filtering
const recentJobs = await prisma.job.findMany({
  where: {
    postedAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  },
})
```

#### Pagination

```typescript
const page = 1
const pageSize = 20
const skip = (page - 1) * pageSize

const [jobs, totalCount] = await Promise.all([
  prisma.job.findMany({
    where: { isActive: true },
    skip,
    take: pageSize,
    orderBy: { postedAt: 'desc' },
  }),
  prisma.job.count({ where: { isActive: true } }),
])

const totalPages = Math.ceil(totalCount / pageSize)
```

#### Transactions

```typescript
// Atomic operations
const result = await prisma.$transaction(async (tx) => {
  // Deduct credits
  const profile = await tx.profile.update({
    where: { id: userId },
    data: { credit: { decrement: 1 } },
  })

  // Create transaction record
  const transaction = await tx.creditTransaction.create({
    data: {
      userId,
      type: 'USAGE',
      amount: -1,
      balanceAfter: profile.credit,
      featureUsed: 'AI_INTERVIEW',
    },
  })

  return { profile, transaction }
})
```

## Best Practices

### 1. Use the Singleton Pattern

Always import the shared Prisma Client instance:

```typescript
import { prisma } from '@/lib/prisma'
// NOT: import { PrismaClient } from '@prisma/client'
```

### 2. Handle Errors Properly

```typescript
try {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { id: userId },
  })
} catch (error) {
  if (error.code === 'P2025') {
    // Record not found
    throw new Error('Profile not found')
  }
  throw error
}
```

### 3. Use Type Safety

```typescript
import type { Prisma } from '@prisma/client'

// Define type-safe input
const profileData: Prisma.ProfileCreateInput = {
  id: userId,
  email: 'user@example.com',
  credit: 5,
}

await prisma.profile.create({ data: profileData })
```

### 4. Select Only What You Need

```typescript
// Bad: Fetching all fields
const profiles = await prisma.profile.findMany()

// Good: Select specific fields
const profiles = await prisma.profile.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  },
})
```

### 5. Connection Management

The singleton client automatically handles connections. For serverless:

```typescript
// Connection is managed automatically
// Close only if needed (e.g., cleanup scripts)
import { disconnectPrisma } from '@/lib/prisma'

await disconnectPrisma()
```

## Migrations

### Development Workflow

```bash
# 1. Make schema changes in prisma/schema.prisma
# 2. Create and apply migration
pnpm db:migrate

# This will:
# - Generate SQL migration file
# - Apply migration to database
# - Regenerate Prisma Client
```

### Production Deployment

```bash
# Deploy migrations in production
pnpm db:migrate:deploy
```

### Migration Best Practices

1. **Always review generated SQL** before applying migrations
2. **Test migrations** in a development environment first
3. **Never modify applied migrations** - create new ones instead
4. **Backup production data** before applying migrations

## Common Patterns

### Service Layer Pattern

```typescript
// src/lib/services/prisma-profiles.ts
import { prisma } from '@/lib/prisma'
import type { Profile, Prisma } from '@prisma/client'

export const prismaProfilesService = {
  async getProfileById(id: string): Promise<Profile | null> {
    return await prisma.profile.findUnique({
      where: { id },
    })
  },

  async createProfile(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return await prisma.profile.create({ data })
  },

  async updateProfile(
    id: string,
    data: Prisma.ProfileUpdateInput
  ): Promise<Profile> {
    return await prisma.profile.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    })
  },
}
```

### Repository Pattern

```typescript
// src/repositories/job-repository.ts
import { prisma } from '@/lib/prisma'
import type { Job, Prisma } from '@prisma/client'

export class JobRepository {
  async findById(id: string) {
    return await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    })
  }

  async findActiveJobs(filters: Prisma.JobWhereInput) {
    return await prisma.job.findMany({
      where: { ...filters, isActive: true },
      include: { company: true },
      orderBy: { postedAt: 'desc' },
    })
  }
}
```

## Troubleshooting

### Common Issues

**1. "PrismaClient is unable to be run in the browser"**

Solution: Ensure you're only importing Prisma in server-side code (Server Components, API routes, Server Actions).

**2. "Can't reach database server"**

Check:
- DATABASE_URL is correctly set
- Database server is running
- Firewall allows connections
- Credentials are correct

**3. "Type 'X' is not assignable to type 'Y'"**

Solution: Regenerate Prisma Client:
```bash
pnpm db:generate
```

**4. "Migration failed"**

- Check database permissions
- Verify schema syntax
- Review migration SQL file
- Ensure no conflicting data

### Debug Mode

Enable query logging:

```typescript
// src/lib/prisma.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma + Next.js Guide](https://www.prisma.io/docs/guides/database/using-prisma-with-nextjs)
- [Prisma + Supabase Integration](https://supabase.com/partners/integrations/prisma)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide)

## Support

For project-specific questions:
- Review existing services in `src/lib/services/prisma-*.ts`
- Check type definitions in `src/types/prisma.ts`
- Refer to the Prisma schema at `prisma/schema.prisma`
