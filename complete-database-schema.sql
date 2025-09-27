-- ApplyMint AI Complete Database Schema
-- This file contains all the SQL statements to create the complete database schema
-- Run this in your Supabase SQL editor to set up the entire database

-- ===========================================
-- PROFILES TABLE (Already exists - included for reference)
-- ===========================================

-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  first_name text NULL,
  last_name text NULL,
  phone_number text NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ===========================================
-- CORE JOB SEARCH TABLES
-- ===========================================

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  website text,
  logo_url text,
  industry text,
  size text CHECK (size IN ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE')),
  location text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  location text NOT NULL,
  is_remote boolean DEFAULT false,
  job_type text CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE')),
  experience_level text CHECK (experience_level IN ('ENTRY', 'MID', 'SENIOR', 'EXECUTIVE')),
  description text NOT NULL,
  requirements text[],
  responsibilities text[],
  benefits text[],
  salary_min numeric,
  salary_max numeric,
  salary_currency text DEFAULT 'USD',
  skills text[],
  posted_at timestamp with time zone DEFAULT now(),
  application_deadline timestamp with time zone,
  is_active boolean DEFAULT true,
  external_job_id text,
  external_source text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  resume_id uuid,
  cover_letter text,
  status text CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED')) DEFAULT 'DRAFT',
  applied_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  notes text,
  UNIQUE(job_id, user_id)
);

-- Saved jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  saved_at timestamp with time zone DEFAULT now(),
  notes text,
  UNIQUE(job_id, user_id)
);

-- ===========================================
-- RESUME MANAGEMENT TABLES
-- ===========================================

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  is_default boolean DEFAULT false,
  is_ai_optimized boolean DEFAULT false,
  original_content text,
  optimized_content text,
  file_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Work experiences table
CREATE TABLE IF NOT EXISTS public.work_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  description text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_current_role boolean DEFAULT false,
  location text,
  skills text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Educations table
CREATE TABLE IF NOT EXISTS public.educations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  grade text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  name text NOT NULL,
  level text CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
  category text CHECK (category IN ('TECHNICAL', 'SOFT', 'LANGUAGE', 'TOOL')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text,
  credential_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  technologies text[],
  project_url text,
  github_url text,
  start_date date NOT NULL,
  end_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Languages table
CREATE TABLE IF NOT EXISTS public.languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  name text NOT NULL,
  proficiency text CHECK (proficiency IN ('BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ===========================================
-- USER PREFERENCES & ANALYTICS TABLES
-- ===========================================

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  job_alerts boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  preferred_job_types text[],
  preferred_locations text[],
  salary_min numeric,
  salary_max numeric,
  salary_currency text DEFAULT 'USD',
  remote_work boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text CHECK (type IN ('JOB_MATCH', 'APPLICATION_UPDATE', 'INTERVIEW_REMINDER', 'SYSTEM')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- ===========================================
-- AI FEATURES TABLES
-- ===========================================

-- Interview sessions table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  session_type text CHECK (session_type IN ('MOCK_INTERVIEW', 'TECHNICAL_PREP', 'BEHAVIORAL_PREP')),
  title text NOT NULL,
  questions jsonb,
  feedback jsonb,
  duration_minutes integer,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Job categories table
CREATE TABLE IF NOT EXISTS public.job_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES job_categories(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Job category mappings junction table
CREATE TABLE IF NOT EXISTS public.job_category_mappings (
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  category_id uuid REFERENCES job_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, category_id)
);

-- ===========================================
-- UTILITY FUNCTIONS & TRIGGERS
-- ===========================================

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_experiences_updated_at BEFORE UPDATE ON work_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_educations_updated_at BEFORE UPDATE ON educations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_sessions_updated_at BEFORE UPDATE ON interview_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- PERFORMANCE INDEXES
-- ===========================================

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- Job applications indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- Saved jobs indexes
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_category_mappings ENABLE ROW LEVEL SECURITY;

-- Companies policies (public read)
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);

-- Jobs policies (public read)
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);

-- Job applications policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON job_applications;
CREATE POLICY "Users can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);

-- Saved jobs policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can create their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can delete their own saved jobs" ON saved_jobs;
CREATE POLICY "Users can view their own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Resumes policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can create their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON resumes;
CREATE POLICY "Users can view their own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Resume-related tables policies (user-specific via resume ownership)
DROP POLICY IF EXISTS "Users can view their own work experiences" ON work_experiences;
DROP POLICY IF EXISTS "Users can create work experiences for their resumes" ON work_experiences;
DROP POLICY IF EXISTS "Users can update work experiences for their resumes" ON work_experiences;
DROP POLICY IF EXISTS "Users can delete work experiences for their resumes" ON work_experiences;
CREATE POLICY "Users can view their own work experiences" ON work_experiences FOR SELECT USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can create work experiences for their resumes" ON work_experiences FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can update work experiences for their resumes" ON work_experiences FOR UPDATE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can delete work experiences for their resumes" ON work_experiences FOR DELETE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));

DROP POLICY IF EXISTS "Users can view their own educations" ON educations;
DROP POLICY IF EXISTS "Users can create educations for their resumes" ON educations;
DROP POLICY IF EXISTS "Users can update educations for their resumes" ON educations;
DROP POLICY IF EXISTS "Users can delete educations for their resumes" ON educations;
CREATE POLICY "Users can view their own educations" ON educations FOR SELECT USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can create educations for their resumes" ON educations FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can update educations for their resumes" ON educations FOR UPDATE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can delete educations for their resumes" ON educations FOR DELETE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));

DROP POLICY IF EXISTS "Users can view their own skills" ON skills;
DROP POLICY IF EXISTS "Users can create skills for their resumes" ON skills;
DROP POLICY IF EXISTS "Users can update skills for their resumes" ON skills;
DROP POLICY IF EXISTS "Users can delete skills for their resumes" ON skills;
CREATE POLICY "Users can view their own skills" ON skills FOR SELECT USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can create skills for their resumes" ON skills FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can update skills for their resumes" ON skills FOR UPDATE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can delete skills for their resumes" ON skills FOR DELETE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));

DROP POLICY IF EXISTS "Users can view their own certifications" ON certifications;
DROP POLICY IF EXISTS "Users can create certifications for their resumes" ON certifications;
DROP POLICY IF EXISTS "Users can update certifications for their resumes" ON certifications;
DROP POLICY IF EXISTS "Users can delete certifications for their resumes" ON certifications;
CREATE POLICY "Users can view their own certifications" ON certifications FOR SELECT USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can create certifications for their resumes" ON certifications FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can update certifications for their resumes" ON certifications FOR UPDATE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can delete certifications for their resumes" ON certifications FOR DELETE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));

DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects for their resumes" ON projects;
DROP POLICY IF EXISTS "Users can update projects for their resumes" ON projects;
DROP POLICY IF EXISTS "Users can delete projects for their resumes" ON projects;
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can create projects for their resumes" ON projects FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can update projects for their resumes" ON projects FOR UPDATE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can delete projects for their resumes" ON projects FOR DELETE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));

DROP POLICY IF EXISTS "Users can view their own languages" ON languages;
DROP POLICY IF EXISTS "Users can create languages for their resumes" ON languages;
DROP POLICY IF EXISTS "Users can update languages for their resumes" ON languages;
DROP POLICY IF EXISTS "Users can delete languages for their resumes" ON languages;
CREATE POLICY "Users can view their own languages" ON languages FOR SELECT USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can create languages for their resumes" ON languages FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can update languages for their resumes" ON languages FOR UPDATE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));
CREATE POLICY "Users can delete languages for their resumes" ON languages FOR DELETE USING (auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id));

-- User preferences policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can create their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity logs policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can create their own activity logs" ON activity_logs;
CREATE POLICY "Users can view their own activity logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interview sessions policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can create their own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON interview_sessions;
CREATE POLICY "Users can view their own interview sessions" ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own interview sessions" ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interview sessions" ON interview_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Job categories policies (public read)
DROP POLICY IF EXISTS "Job categories are viewable by everyone" ON job_categories;
DROP POLICY IF EXISTS "Job category mappings are viewable by everyone" ON job_category_mappings;
CREATE POLICY "Job categories are viewable by everyone" ON job_categories FOR SELECT USING (true);
CREATE POLICY "Job category mappings are viewable by everyone" ON job_category_mappings FOR SELECT USING (true);

-- ===========================================
-- SETUP COMPLETE
-- ===========================================

-- The database schema is now complete with:
-- ✅ 16 core tables created
-- ✅ All foreign key relationships established
-- ✅ Row Level Security policies configured
-- ✅ Performance indexes added
-- ✅ Auto-updating timestamp triggers
-- ✅ Data integrity constraints
--
-- You can now start building your ApplyMint AI application!