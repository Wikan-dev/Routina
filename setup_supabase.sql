-- 1. Create the habits table
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  days_done JSONB DEFAULT '[]'::jsonb
);

-- 2. Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows users to see their own habits
CREATE POLICY "Users can see their own habits"
ON habits FOR SELECT
USING (auth.uid() = user_id);

-- 4. Create a policy that allows users to insert their own habits
CREATE POLICY "Users can insert their own habits"
ON habits FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Create a policy that allows users to update their own habits
CREATE POLICY "Users can update their own habits"
ON habits FOR UPDATE
USING (auth.uid() = user_id);

-- 6. Create a policy that allows users to delete their own habits
CREATE POLICY "Users can delete their own habits"
ON habits FOR DELETE
USING (auth.uid() = user_id);
