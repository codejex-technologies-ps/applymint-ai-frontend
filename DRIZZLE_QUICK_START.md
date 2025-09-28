# 🚀 Drizzle ORM Quick Start Guide

## Overview
ApplyMint AI now includes a complete Drizzle ORM integration for type-safe, high-performance database operations. This guide will get you up and running in 5 minutes.

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
# Dependencies are already installed, but if you need to reinstall:
pnpm install drizzle-orm postgres drizzle-zod
pnpm install -D drizzle-kit @types/pg tsx
```

### 2. Environment Configuration
Copy `.env.local.example` to `.env.local` and add:

```bash
# Your existing Supabase config (keep these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NEW: Database URL for Drizzle (required)
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

### 3. Test Your Connection
```bash
# Test database connectivity
pnpm db:test
```

### 4. Start Using Drizzle
```typescript
import { drizzleProfilesService } from '@/lib/services/drizzle-profiles';

// Type-safe operations
const profile = await drizzleProfilesService.getProfileById(userId);
const jobs = await drizzleJobsService.searchJobs({ query: 'developer' });
```

## 🎯 Key Benefits

### ✅ Type Safety
- **IntelliSense**: Full autocomplete for all database operations
- **Compile-time checks**: Catch errors before runtime
- **Zero type casting**: Direct TypeScript inference

### ✅ Performance
- **Connection pooling**: Up to 10 concurrent connections
- **Optimized queries**: Better SQL generation than ORM alternatives
- **Efficient joins**: Type-safe relationship loading

### ✅ Developer Experience
- **Drizzle Studio**: Visual database browser (`pnpm db:studio`)
- **Clear errors**: Descriptive error messages and debugging
- **Migration tools**: Schema versioning and migration support

## 📋 Available Commands

```bash
# Development
pnpm db:test         # Test database connection
pnmp db:studio       # Open visual database browser
pnpm db:generate     # Generate migrations from schema
pnpm db:push         # Push schema changes to database

# Production
pnpm db:migrate      # Run migrations in production
```

## 🎨 Schema Overview

All 16 database tables are fully implemented:

### Core Tables
- **profiles** - User profiles (ready to use)
- **companies** - Company information  
- **jobs** - Job listings with search

### Resume System  
- **resumes** - Resume management
- **work_experiences** - Employment history
- **educations** - Academic background
- **skills** - Technical and soft skills
- **certifications** - Professional certs
- **projects** - Portfolio projects
- **languages** - Language proficiency

### Job Application System
- **job_applications** - Application tracking
- **saved_jobs** - Bookmarked positions
- **job_alerts** - Custom notifications

### AI Interview System
- **interview_sessions** - Practice sessions
- **interview_questions** - AI-generated questions
- **interview_responses** - User responses and scoring

### Analytics & Notifications
- **user_analytics** - Usage tracking
- **notifications** - System notifications

## 💡 Usage Examples

### Basic Operations
```typescript
import { db } from '@/lib/db/connection';
import { profiles, jobs } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Simple select
const user = await db
  .select()
  .from(profiles)
  .where(eq(profiles.id, userId));

// Complex query with filters
const activeJobs = await db
  .select()
  .from(jobs)
  .where(and(
    eq(jobs.isActive, true),
    eq(jobs.isRemote, true)
  ))
  .orderBy(desc(jobs.postedAt))
  .limit(10);
```

### Using Services (Recommended)
```typescript
import { drizzleProfilesService } from '@/lib/services/drizzle-profiles';
import { drizzleJobsService } from '@/lib/services/drizzle-jobs';

// Profile operations
const profile = await drizzleProfilesService.getProfileById(userId);
const updated = await drizzleProfilesService.updateProfile(userId, {
  firstName: 'John',
  lastName: 'Doe'
});

// Job search with filters
const jobResults = await drizzleJobsService.searchJobs({
  query: 'React Developer',
  location: 'Remote',
  jobTypes: ['FULL_TIME'],
  salaryMin: 80000
}, 1, 20); // page 1, 20 results

// Get jobs with company info
const jobWithCompany = await drizzleJobsService.getJobById(jobId);
console.log(jobWithCompany.company?.name);
```

### Advanced Relations
```typescript
import { db } from '@/lib/db/connection';
import { resumes, workExperiences, skills } from '@/lib/db/schema';

// Get resume with all related data
const resumeWithDetails = await db
  .select()
  .from(resumes)
  .leftJoin(workExperiences, eq(resumes.id, workExperiences.resumeId))
  .leftJoin(skills, eq(resumes.id, skills.resumeId))
  .where(eq(resumes.userId, userId));
```

## 🔄 Migration Strategy

### Gradual Migration (Recommended)
1. **Start small**: Migrate one service at a time
2. **Use hybrid approach**: Run both Supabase and Drizzle in parallel
3. **Verify consistency**: Compare results between implementations
4. **Performance test**: Measure improvements

### Example Migration
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// After (Drizzle)
const profile = await drizzleProfilesService.getProfileById(userId);
```

## 🧪 Testing Your Setup

### Connection Test
```bash
pnpm db:test
```

### Performance Comparison
```typescript
import { hybridProfilesService } from '@/lib/services/profiles-hybrid';

const perf = await hybridProfilesService.performanceTest(userId);
console.log(`Drizzle vs Supabase: ${perf.improvement}`);
```

### Data Consistency Check
```typescript
const verification = await hybridProfilesService.verifyMigration(userId);
if (!verification.consistent) {
  console.log('Differences found:', verification.differences);
}
```

## 🛠️ Troubleshooting

### Common Issues

**"Missing DATABASE_URL" Error**
```bash
# Add to .env.local
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT-ID.supabase.co:5432/postgres
```

**Connection Timeouts**
- Check your Supabase database is active
- Verify your database password is correct
- Ensure your IP is whitelisted in Supabase

**Type Errors**
- Run `pnpm run build` to check TypeScript compilation
- Ensure all imports are correct
- Check schema definitions match your database

**Performance Issues**
- Connection pooling reduces overhead for multiple queries
- Use `db:studio` to analyze query execution
- Consider indexing for frequently searched columns

## 📚 Next Steps

1. **[Read the Complete Guide](./DRIZZLE_INTEGRATION_GUIDE.md)** - Comprehensive documentation
2. **[Explore Schema Files](./src/lib/db/schema/)** - See all table definitions  
3. **[Try Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)** - Visual database browser
4. **[Migration Examples](./src/lib/services/profiles-hybrid.ts)** - See migration patterns

## 🎯 Success Criteria

✅ **Type Safety**: Zero runtime type errors  
✅ **Performance**: Faster queries with connection pooling  
✅ **Maintainability**: Clear, readable database code  
✅ **Scalability**: Ready for production workloads  

---

**Ready to start?** Run `pnpm db:test` to verify your setup, then explore the services in `src/lib/services/`!