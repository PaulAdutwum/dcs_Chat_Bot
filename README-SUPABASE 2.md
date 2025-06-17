# DCS Chatbot Supabase Integration Guide

This guide explains how to set up and test the Supabase integration for the DCS Chatbot.

## What's being logged to Supabase

The chatbot now logs the following user interactions to Supabase:

1. **User Messages**: Every message sent by the user is logged
2. **Button Clicks**: When a user clicks on a suggestion button
3. **Professor Contact Requests**: When a user submits a request to contact a professor

## Setup Instructions

### 1. Configure Supabase Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Create the Database Tables

Run the migration file to create the necessary tables in Supabase:

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Copy and paste the contents of `/supabase/migrations/20231108000000_create_user_interactions.sql`
4. Run the SQL query

Alternatively, if you are using Supabase CLI:

```bash
supabase migration up
```

## Testing the Integration

### Check if Supabase is Working

1. Open your browser console (F12 or right-click -> Inspect -> Console)
2. Use the chatbot and look for the following logs:
   - "Successfully logged to Supabase:" (success)
   - "Error logging to Supabase:" (error)

### View the Data in Supabase

1. Go to your Supabase project
2. Navigate to the Table Editor
3. Select the `user_interactions` table
4. You should see records for:
   - `interaction_type`: "user_message", "suggestion_click", or "professor_contact"
   - `content`: JSON with message content and metadata
   - `user_id`: Unique identifier for each user session

### Verifying Data Structure

The logged data follows this structure:

```typescript
{
  user_id: string;           // UUID of the user (anonymous or authenticated)
  interaction_type: string;  // Type of interaction (user_message, suggestion_click, professor_contact)
  content: {                 // Specific data for each interaction type
    message?: string;        // For user messages
    button_id?: string;      // For suggestion clicks
    timestamp: string;       // ISO timestamp
    // Additional fields depending on interaction type
  };
  created_at: string;        // Server timestamp
}
```

## Troubleshooting

### Common Issues

1. **No data appearing in Supabase**

   - Check browser console for errors
   - Verify environment variables are set correctly
   - Ensure the database table exists and has the correct schema

2. **Permission errors**

   - Check that Row Level Security (RLS) policies are configured correctly
   - Verify that the anonymous key has insert permissions

3. **Supabase client not initializing**
   - Look for the console log: "Supabase client initialized successfully"
   - If you see "Using mock client", it means the environment variables are missing

## Analytics Opportunities

With this data in Supabase, you can:

1. Analyze popular questions and topics
2. Track which suggestion buttons get clicked most often
3. Identify common user journeys through the chatbot
4. Monitor professor contact request frequency
5. Create visualizations of chat usage patterns

For more complex analytics, you can use Supabase's PostgreSQL functions and PostgREST API.
