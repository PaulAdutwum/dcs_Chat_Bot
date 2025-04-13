-- Create user_interactions table for storing chat interactions
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Add indexes for common queries
  CONSTRAINT user_interactions_pkey PRIMARY KEY (id)
);

-- Create index for filtering by user_id
CREATE INDEX IF NOT EXISTS user_interactions_user_id_idx ON user_interactions (user_id);

-- Create index for filtering by interaction_type
CREATE INDEX IF NOT EXISTS user_interactions_type_idx ON user_interactions (interaction_type);

-- Create index for timestamp-based queries
CREATE INDEX IF NOT EXISTS user_interactions_created_at_idx ON user_interactions (created_at);

-- Add RLS policies
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts" ON user_interactions 
  FOR INSERT WITH CHECK (true);

-- Allow users to view only their own interactions
CREATE POLICY "Users can view own interactions" ON user_interactions 
  FOR SELECT USING (auth.uid()::text = user_id);

-- Allow service role to access all interactions
CREATE POLICY "Service role has full access" ON user_interactions 
  USING (auth.role() = 'service_role'); 