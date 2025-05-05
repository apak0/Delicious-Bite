/*
  # Add user signup policies

  1. Changes
    - Add RLS policy to allow user signup
    - Add policy for users to update their own data
  
  2. Security
    - Enable RLS on users table (already enabled)
    - Add policy for user signup
    - Add policy for users to update their own data
*/

-- Policy to allow user signup
CREATE POLICY "Allow user signup"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow users to insert their own data during signup
  auth.uid() = id
);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure the select policy exists (already exists but included for completeness)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can read their own data'
  ) THEN
    CREATE POLICY "Users can read their own data"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
  END IF;
END $$;