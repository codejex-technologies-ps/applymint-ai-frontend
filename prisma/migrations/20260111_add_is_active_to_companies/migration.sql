-- Add is_active column to companies table for soft delete functionality
-- This enables marking companies as inactive instead of hard deleting them

-- Step 1: Add the is_active column with default value
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Step 2: Update any existing records to be active (in case column was added as NULL)
UPDATE public.companies SET is_active = true WHERE is_active IS NULL;

-- Step 3: Make the column NOT NULL after setting defaults
ALTER TABLE public.companies
ALTER COLUMN is_active SET NOT NULL;

-- Step 4: Add index for faster filtering on is_active
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON public.companies(is_active);
