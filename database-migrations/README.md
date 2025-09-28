# Database Migrations

This folder contains SQL migration scripts for the ApplyMint AI database schema.

## Available Migrations

### `add-extended-profile-fields.sql`

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

**Features**:
- ✅ URL validation constraints for social links
- ✅ Character length limits for text fields
- ✅ Enum constraints for status and preference fields
- ✅ Performance indexes on commonly searched fields
- ✅ Updated trigger function for new user creation
- ✅ Verification queries to confirm successful migration

## How to Use

1. **Backup your database** before running any migration
2. Open your Supabase SQL editor
3. Copy and paste the entire migration file
4. Execute the SQL script
5. Verify the results using the included verification queries

## Important Notes

- All new fields are optional (nullable)
- URL fields include validation constraints
- Indexes are created for performance optimization
- The migration is designed to be safe and reversible
- Existing data is preserved and unaffected

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