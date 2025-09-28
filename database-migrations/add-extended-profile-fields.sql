-- ApplyMint AI Database Migration: Add Extended Profile Fields
-- This migration adds bio, location, website, LinkedIn, GitHub and other fields to the profiles table
-- Run this SQL in your Supabase SQL editor

-- ============================================================================
-- 1. ADD NEW COLUMNS TO PROFILES TABLE
-- ============================================================================

-- Add extended profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS current_position text,
ADD COLUMN IF NOT EXISTS company text,
ADD COLUMN IF NOT EXISTS years_of_experience integer,
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'available',
ADD COLUMN IF NOT EXISTS preferred_work_type text DEFAULT 'full_time',
ADD COLUMN IF NOT EXISTS profile_visibility text DEFAULT 'public';

-- Add constraints for the new fields
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS check_bio_length CHECK (char_length(bio) <= 2000),
ADD CONSTRAINT IF NOT EXISTS check_location_length CHECK (char_length(location) <= 100),
ADD CONSTRAINT IF NOT EXISTS check_website_url CHECK (website IS NULL OR website ~* '^https?://'),
ADD CONSTRAINT IF NOT EXISTS check_linkedin_url CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://(www\.)?linkedin\.com/'),
ADD CONSTRAINT IF NOT EXISTS check_github_url CHECK (github_url IS NULL OR github_url ~* '^https?://(www\.)?github\.com/'),
ADD CONSTRAINT IF NOT EXISTS check_twitter_url CHECK (twitter_url IS NULL OR twitter_url ~* '^https?://(www\.)?(twitter\.com|x\.com)/'),
ADD CONSTRAINT IF NOT EXISTS check_portfolio_url CHECK (portfolio_url IS NULL OR portfolio_url ~* '^https?://'),
ADD CONSTRAINT IF NOT EXISTS check_current_position_length CHECK (char_length(current_position) <= 100),
ADD CONSTRAINT IF NOT EXISTS check_company_length CHECK (char_length(company) <= 100),
ADD CONSTRAINT IF NOT EXISTS check_years_experience CHECK (years_of_experience IS NULL OR years_of_experience >= 0),
ADD CONSTRAINT IF NOT EXISTS check_availability_status CHECK (availability_status IN ('available', 'not_available', 'open_to_opportunities')),
ADD CONSTRAINT IF NOT EXISTS check_preferred_work_type CHECK (preferred_work_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
ADD CONSTRAINT IF NOT EXISTS check_profile_visibility CHECK (profile_visibility IN ('public', 'private', 'connections_only'));

-- ============================================================================
-- 2. UPDATE EXISTING TRIGGER FUNCTION TO HANDLE NEW FIELDS
-- ============================================================================

-- Update the profile creation function to handle new metadata fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log the trigger execution for debugging
  RAISE NOTICE 'Creating profile for user: %', NEW.id;
  RAISE NOTICE 'User email: %', NEW.email;
  RAISE NOTICE 'User metadata: %', NEW.raw_user_meta_data;
  
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      first_name, 
      last_name,
      bio,
      location,
      website,
      linkedin_url,
      github_url
    )
    VALUES (
      NEW.id, 
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.raw_user_meta_data->>'bio',
      NEW.raw_user_meta_data->>'location',
      NEW.raw_user_meta_data->>'website',
      NEW.raw_user_meta_data->>'linkedin_url',
      NEW.raw_user_meta_data->>'github_url'
    );
    
    RAISE NOTICE 'Successfully created extended profile for user: %', NEW.id;
    
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
      -- Don't fail the user creation, just log the error
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Create indexes for commonly searched fields
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location) WHERE location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles(company) WHERE company IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON public.profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_profiles_work_type ON public.profiles(preferred_work_type);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON public.profiles(profile_visibility);

-- ============================================================================
-- 4. VERIFICATION QUERIES
-- ============================================================================

-- Check if all new columns were added successfully
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN (
    'bio', 'location', 'website', 'linkedin_url', 'github_url', 
    'twitter_url', 'portfolio_url', 'current_position', 'company',
    'years_of_experience', 'availability_status', 'preferred_work_type', 'profile_visibility'
  )
ORDER BY column_name;

-- Check constraints
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND constraint_type = 'CHECK'
ORDER BY constraint_name;

-- Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'profiles' 
  AND schemaname = 'public'
  AND indexname LIKE 'idx_profiles_%'
ORDER BY indexname;

RAISE NOTICE '✅ Extended profile fields migration completed successfully!';
RAISE NOTICE '📝 New fields added:';
RAISE NOTICE '- bio (text, max 2000 chars)';
RAISE NOTICE '- location (text, max 100 chars)';
RAISE NOTICE '- website (text, URL validated)';
RAISE NOTICE '- linkedin_url (text, LinkedIn URL validated)';
RAISE NOTICE '- github_url (text, GitHub URL validated)';
RAISE NOTICE '- twitter_url (text, Twitter/X URL validated)';
RAISE NOTICE '- portfolio_url (text, URL validated)';
RAISE NOTICE '- current_position (text, max 100 chars)';
RAISE NOTICE '- company (text, max 100 chars)';
RAISE NOTICE '- years_of_experience (integer, >= 0)';
RAISE NOTICE '- availability_status (enum: available, not_available, open_to_opportunities)';
RAISE NOTICE '- preferred_work_type (enum: full_time, part_time, contract, freelance, internship)';
RAISE NOTICE '- profile_visibility (enum: public, private, connections_only)';