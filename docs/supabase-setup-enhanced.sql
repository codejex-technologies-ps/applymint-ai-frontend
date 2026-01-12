-- ApplyMint AI Enhanced Supabase Database Setup
-- Run this SQL in your Supabase SQL editor to set up the required schema
-- This enhanced version includes better error handling and debugging

-- ============================================================================
-- 1. CREATE PROFILES TABLE
-- ============================================================================

-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create the profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  first_name text NULL,
  last_name text NULL,
  phone_number text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_email_key UNIQUE (email),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- ============================================================================
-- 2. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enhanced profile creation function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log the trigger execution for debugging
  RAISE NOTICE 'Creating profile for user: %', NEW.id;
  RAISE NOTICE 'User email: %', NEW.email;
  RAISE NOTICE 'User metadata: %', NEW.raw_user_meta_data;
  
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
      NEW.id, 
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    
    RAISE NOTICE 'Successfully created profile for user: %', NEW.id;
    
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
      -- Don't fail the user creation, just log the error
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. CREATE TRIGGERS
-- ============================================================================

-- Create trigger to automatically update updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically create a profile when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. SET UP ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Create policies for the profiles table
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Check if the table was created correctly
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if triggers exist
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
  AND event_object_table IN ('profiles')
  OR (event_object_schema = 'auth' AND event_object_table = 'users');

-- Check if RLS policies exist
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- ============================================================================
-- 6. TEST FUNCTION (Optional - for debugging)
-- ============================================================================

-- Function to test profile creation manually
CREATE OR REPLACE FUNCTION test_profile_creation(
  test_user_id uuid DEFAULT gen_random_uuid(),
  test_email text DEFAULT 'test@example.com',
  test_first_name text DEFAULT 'Test',
  test_last_name text DEFAULT 'User'
)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Try to insert a test profile
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (test_user_id, test_email, test_first_name, test_last_name);
    
    result := json_build_object(
      'success', true,
      'message', 'Profile created successfully',
      'user_id', test_user_id
    );
    
    -- Clean up test data
    DELETE FROM public.profiles WHERE id = test_user_id;
    
  EXCEPTION 
    WHEN OTHERS THEN
      result := json_build_object(
        'success', false,
        'error', SQLERRM,
        'detail', SQLSTATE
      );
  END;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the test (uncomment to test)
-- SELECT test_profile_creation();

RAISE NOTICE '✅ Enhanced Supabase setup completed successfully!';
RAISE NOTICE '📝 Next steps:';
RAISE NOTICE '1. Check email authentication settings in Supabase Dashboard';
RAISE NOTICE '2. Configure SMTP settings for email delivery';
RAISE NOTICE '3. Test user registration with a real email address';
RAISE NOTICE '4. Verify profile creation works automatically';