-- ApplyMint AI Database Migration: Add New Profile, Job, and Application Fields
-- Date: January 11, 2026
-- Description: Adds headline, avatar_url, timezone, is_open_to_work to profiles
--              Adds search_vector, visa_sponsorship, company_rating, application_count to jobs
--              Adds follow_up_date, salary_offered, rejection_reason, interview_count to job_applications

-- ============================================================================
-- 1. ADD NEW COLUMNS TO PROFILES TABLE
-- ============================================================================

-- Add new profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS headline text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS is_open_to_work boolean DEFAULT true;

-- Add constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS check_headline_length CHECK (char_length(headline) <= 200),
ADD CONSTRAINT IF NOT EXISTS check_avatar_url CHECK (avatar_url IS NULL OR avatar_url ~* '^https?://'),
ADD CONSTRAINT IF NOT EXISTS check_timezone CHECK (timezone IS NULL OR char_length(timezone) <= 100);

COMMENT ON COLUMN public.profiles.headline IS 'Professional headline e.g. "Senior Software Engineer | React Expert"';
COMMENT ON COLUMN public.profiles.avatar_url IS 'Profile picture URL';
COMMENT ON COLUMN public.profiles.timezone IS 'User timezone (e.g., America/New_York)';
COMMENT ON COLUMN public.profiles.is_open_to_work IS 'Whether user is currently open to job opportunities';

-- ============================================================================
-- 2. ADD NEW COLUMNS TO JOBS TABLE
-- ============================================================================

-- Add new job fields
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS search_vector tsvector,
ADD COLUMN IF NOT EXISTS visa_sponsorship boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS company_rating numeric(3,2),
ADD COLUMN IF NOT EXISTS application_count integer DEFAULT 0;

-- Add constraints
ALTER TABLE public.jobs 
ADD CONSTRAINT IF NOT EXISTS check_company_rating CHECK (company_rating IS NULL OR (company_rating >= 0 AND company_rating <= 5)),
ADD CONSTRAINT IF NOT EXISTS check_application_count CHECK (application_count >= 0);

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON public.jobs USING GIN(search_vector);

-- Create function to update search_vector automatically
CREATE OR REPLACE FUNCTION public.update_job_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skills, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search_vector on insert/update
DROP TRIGGER IF EXISTS trigger_update_job_search_vector ON public.jobs;
CREATE TRIGGER trigger_update_job_search_vector
BEFORE INSERT OR UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_job_search_vector();

-- Update existing rows to populate search_vector
UPDATE public.jobs SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(skills, ' '), '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(location, '')), 'D')
WHERE search_vector IS NULL;

COMMENT ON COLUMN public.jobs.search_vector IS 'Full-text search vector for optimized job search';
COMMENT ON COLUMN public.jobs.visa_sponsorship IS 'Whether company offers visa sponsorship';
COMMENT ON COLUMN public.jobs.company_rating IS 'Company rating (0-5)';
COMMENT ON COLUMN public.jobs.application_count IS 'Denormalized count of applications (updated via trigger)';

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_jobs_visa_sponsorship ON public.jobs(visa_sponsorship) WHERE visa_sponsorship = true;
CREATE INDEX IF NOT EXISTS idx_jobs_company_rating ON public.jobs(company_rating) WHERE company_rating IS NOT NULL;

-- ============================================================================
-- 3. ADD NEW COLUMNS TO JOB_APPLICATIONS TABLE
-- ============================================================================

-- Add new job application fields
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS follow_up_date timestamptz,
ADD COLUMN IF NOT EXISTS salary_offered numeric(12,2),
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS interview_count integer DEFAULT 0;

-- Add constraints
ALTER TABLE public.job_applications 
ADD CONSTRAINT IF NOT EXISTS check_salary_offered CHECK (salary_offered IS NULL OR salary_offered >= 0),
ADD CONSTRAINT IF NOT EXISTS check_interview_count CHECK (interview_count >= 0),
ADD CONSTRAINT IF NOT EXISTS check_rejection_reason_length CHECK (char_length(rejection_reason) <= 1000);

COMMENT ON COLUMN public.job_applications.follow_up_date IS 'Scheduled follow-up reminder date';
COMMENT ON COLUMN public.job_applications.salary_offered IS 'Salary offered if applicable';
COMMENT ON COLUMN public.job_applications.rejection_reason IS 'Reason for rejection if rejected';
COMMENT ON COLUMN public.job_applications.interview_count IS 'Number of interview rounds conducted';

-- Create index for follow-up reminders
CREATE INDEX IF NOT EXISTS idx_job_applications_follow_up ON public.job_applications(follow_up_date) 
WHERE follow_up_date IS NOT NULL AND status NOT IN ('REJECTED', 'ACCEPTED');

-- ============================================================================
-- 4. CREATE TRIGGER TO UPDATE APPLICATION_COUNT ON JOBS
-- ============================================================================

-- Function to update application count
CREATE OR REPLACE FUNCTION public.update_job_application_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs 
    SET application_count = application_count + 1
    WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs 
    SET application_count = GREATEST(0, application_count - 1)
    WHERE id = OLD.job_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_job_application_count ON public.job_applications;
CREATE TRIGGER trigger_update_job_application_count
AFTER INSERT OR DELETE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_job_application_count();

-- Recalculate application counts for existing jobs
UPDATE public.jobs j
SET application_count = (
  SELECT COUNT(*) 
  FROM public.job_applications ja 
  WHERE ja.job_id = j.id
);

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Verify profiles columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('headline', 'avatar_url', 'timezone', 'is_open_to_work')
ORDER BY column_name;

-- Verify jobs columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'jobs'
  AND column_name IN ('search_vector', 'visa_sponsorship', 'company_rating', 'application_count')
ORDER BY column_name;

-- Verify job_applications columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'job_applications'
  AND column_name IN ('follow_up_date', 'salary_offered', 'rejection_reason', 'interview_count')
ORDER BY column_name;

-- Verify indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_jobs_search_vector', 
    'idx_jobs_visa_sponsorship', 
    'idx_jobs_company_rating',
    'idx_job_applications_follow_up'
  )
ORDER BY tablename, indexname;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary of changes:
-- ✅ Added 4 new fields to profiles table
-- ✅ Added 4 new fields to jobs table with full-text search support
-- ✅ Added 4 new fields to job_applications table
-- ✅ Created triggers for automatic search_vector updates
-- ✅ Created triggers for automatic application_count updates
-- ✅ Added appropriate indexes for performance
-- ✅ Added data validation constraints
-- ✅ Added helpful column comments
