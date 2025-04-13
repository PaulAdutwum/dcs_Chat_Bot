-- DCS Chatbot Database Setup
-- This script sets up the necessary tables for the DCS chatbot application

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Enable Row Level Security
ALTER DATABASE postgres SET "enable_row_level_security" TO on;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_interests table
CREATE TABLE IF NOT EXISTS user_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    interest TEXT NOT NULL,
    source TEXT,
    confidence REAL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, interest)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

-- Enable Row Level Security (RLS) on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- For user_profiles
CREATE POLICY "Users can view their own profiles"
    ON user_profiles FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profiles"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profiles"
    ON user_profiles FOR UPDATE
    USING (auth.uid()::text = user_id);

-- For user_interests
CREATE POLICY "Users can view their own interests"
    ON user_interests FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own interests"
    ON user_interests FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own interests"
    ON user_interests FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own interests"
    ON user_interests FOR DELETE
    USING (auth.uid()::text = user_id);

-- For chat_messages
CREATE POLICY "Users can view their own messages"
    ON chat_messages FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updating updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Insert test data (optional - comment out if not needed)
-- INSERT INTO user_profiles (user_id) VALUES ('test-user-id');
-- INSERT INTO user_interests (user_id, interest) VALUES ('test-user-id', 'Computer Science');
-- INSERT INTO chat_messages (user_id, role, content, session_id) 
--    VALUES ('test-user-id', 'user', 'Hello, I am interested in learning more about DCS programs', 'test-session-1');

-- Grant permissions for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create anonymous access policy for development (optional - comment out for production)
CREATE POLICY "Anonymous can use the system for development"
    ON user_profiles FOR ALL
    USING (true);

CREATE POLICY "Anonymous can use the system for development"
    ON user_interests FOR ALL
    USING (true);

CREATE POLICY "Anonymous can use the system for development"
    ON chat_messages FOR ALL
    USING (true);

-- Grant permissions for anonymous users (optional - comment out for production)
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon; 