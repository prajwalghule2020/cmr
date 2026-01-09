-- Create userskills table in Supabase
-- Run this SQL in your Supabase SQL Editor (Database > SQL Editor)

CREATE TABLE IF NOT EXISTS public.userskills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience NUMERIC DEFAULT 0,
    category TEXT NOT NULL CHECK (category IN ('technical', 'programming', 'design', 'management', 'communication', 'analytical', 'creative', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_userskills_user_id ON public.userskills(user_id);

-- Create index for searching by skill name
CREATE INDEX IF NOT EXISTS idx_userskills_skill_name ON public.userskills(skill_name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.userskills ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own skills
CREATE POLICY "Users can view their own skills" 
    ON public.userskills
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own skills
CREATE POLICY "Users can insert their own skills" 
    ON public.userskills
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own skills
CREATE POLICY "Users can update their own skills" 
    ON public.userskills
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own skills
CREATE POLICY "Users can delete their own skills" 
    ON public.userskills
    FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_userskills_updated_at
    BEFORE UPDATE ON public.userskills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
