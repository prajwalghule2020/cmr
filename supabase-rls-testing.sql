-- OPTION 1: Temporarily disable RLS for testing (NOT RECOMMENDED FOR PRODUCTION)
-- Run this in Supabase SQL Editor if you want to test without authentication

ALTER TABLE public.userskills DISABLE ROW LEVEL SECURITY;

-- Later, re-enable it with:
-- ALTER TABLE public.userskills ENABLE ROW LEVEL SECURITY;


-- OPTION 2: Check existing RLS policies
-- Run this to see what policies exist:

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'userskills';


-- OPTION 3: Add a policy for testing that allows inserts without user_id check (TEMPORARY)
-- This allows testing but is NOT secure for production

DROP POLICY IF EXISTS "Allow anonymous inserts for testing" ON public.userskills;

CREATE POLICY "Allow anonymous inserts for testing"
ON public.userskills
FOR INSERT
TO anon
WITH CHECK (true);

-- Remember to remove this policy after testing:
-- DROP POLICY "Allow anonymous inserts for testing" ON public.userskills;
