-- Helper functions for Supabase DCS Chatbot

-- Function to get recent interactions for a user
CREATE OR REPLACE FUNCTION get_recent_user_interactions(p_user_id TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  interaction_type TEXT,
  content JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT ui.id, ui.interaction_type, ui.content, ui.created_at
  FROM user_interactions ui
  WHERE ui.user_id = p_user_id
  ORDER BY ui.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular user queries
CREATE OR REPLACE FUNCTION get_popular_user_queries(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  message TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    content->>'message' as message,
    COUNT(*) as count
  FROM user_interactions
  WHERE 
    interaction_type = 'user_message' AND
    content->>'message' IS NOT NULL
  GROUP BY content->>'message'
  ORDER BY count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count interactions by type
CREATE OR REPLACE FUNCTION count_interactions_by_type()
RETURNS TABLE (
  interaction_type TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ui.interaction_type,
    COUNT(*) as count
  FROM user_interactions ui
  GROUP BY ui.interaction_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a comment to show how to use these functions
COMMENT ON FUNCTION get_recent_user_interactions IS 
'Get recent interactions for a specific user. 
Example: SELECT * FROM get_recent_user_interactions(''your-user-id'');';

COMMENT ON FUNCTION get_popular_user_queries IS 
'Get most popular user messages.
Example: SELECT * FROM get_popular_user_queries(5);';

COMMENT ON FUNCTION count_interactions_by_type IS 
'Count interactions by type.
Example: SELECT * FROM count_interactions_by_type();'; 