# Database Migrations

This folder contains SQL migration scripts for the ApplyMint AI database schema.

## Available Migrations

### `add-extended-profile-fields.sql` (Legacy)

**Purpose**: Extends the profiles table with additional fields for comprehensive user profiles.

**Fields Added**:
- `bio` (text, max 2000 chars) - Professional biography
- `location` (text, max 100 chars) - User location
- `website` (text) - Personal website URL (validated)
- `linkedin_url` (text) - LinkedIn profile URL (validated)
- `github_url` (text) - GitHub profile URL (validated)
- `twitter_url` (text) - Twitter/X profile URL (validated)
- `portfolio_url` (text) - Portfolio website URL (validated)
- `current_position` (text, max 100 chars) - Current job title
- `company` (text, max 100 chars) - Current company
- `years_of_experience` (integer, >= 0) - Years of professional experience
- `availability_status` (enum) - Job search availability status
- `preferred_work_type` (enum) - Preferred employment type
- `profile_visibility` (enum) - Profile visibility settings

**Status**: ⚠️ Partially applied - some fields may already exist in database

---

### `add-new-profile-job-fields.sql` ⭐ **LATEST**

**Date**: January 11, 2026

**Purpose**: Adds new fields to profiles, jobs, and job_applications tables with full-text search and automatic triggers.

**Profiles Table - New Fields**:
- `headline` (text, max 200 chars) - Professional headline
- `avatar_url` (text) - Profile picture URL
- `timezone` (text) - User timezone
- `is_open_to_work` (boolean, default: true) - Job seeking status

**Jobs Table - New Fields**:
- `search_vector` (tsvector) - Full-text search optimization
- `visa_sponsorship` (boolean) - Visa sponsorship availability
- `company_rating` (numeric 0-5) - Company rating
- `application_count` (integer) - Denormalized application count

**Job Applications Table - New Fields**:
- `follow_up_date` (timestamptz) - Follow-up reminder
- `salary_offered` (numeric) - Offered salary
- `rejection_reason` (text) - Rejection reason
- `interview_count` (integer) - Interview rounds count

**Features**:
- ✅ Full-text search with automatic tsvector updates
- ✅ Automatic application count tracking via triggers
- ✅ URL validation constraints
- ✅ Performance-optimized indexes
- ✅ Data validation constraints
- ✅ Column comments for documentation
- ✅ Verification queries included

**Status**: 🟢 Ready to apply

---

## How to Use

1. **Backup your database** before running any migration
2. Open your Supabase SQL editor
3. Copy and paste the migration file content
4. Execute the SQL script
5. Run the verification queries at the bottom to confirm success

## Important Notes

- All new fields are optional (nullable)
- URL fields include validation constraints
- Indexes are created for performance optimization
- Triggers automatically maintain denormalized counts
- The migrations are designed to be safe (use `IF NOT EXISTS`)
- Existing data is preserved and unaffected

## Migration Order

If starting from scratch:
1. `add-extended-profile-fields.sql` (if needed)
2. `add-new-profile-job-fields.sql` ⭐ **(Run this one)**

## After Migration

Once the migration is complete:

1. The profile form will show all new fields
2. Users can update their extended profile information
3. Server actions will handle the new field validation
4. TypeScript types are already updated to match the new schema

## Verification

The migration includes verification queries that will show:
- All new columns added successfully
- Constraints created properly  
- Indexes created for performance
- Updated trigger function working correctly

Run these queries after migration to ensure everything is working as expected.