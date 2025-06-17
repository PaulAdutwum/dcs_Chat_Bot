# Supabase Setup for DCS Chatbot

This guide will help you set up and configure Supabase for the DCS Chatbot application.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, real-time subscriptions, and storage.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The DCS Chatbot codebase

## Step 1: Create a Supabase Project

1. Log in to your Supabase account
2. Click "New Project"
3. Enter a project name (e.g., "dcs-chatbot")
4. Enter a secure database password
5. Choose a region closest to your users
6. Click "Create new project"

Wait for your project to be set up (usually takes about 1-2 minutes).

## Step 2: Get Your API Keys

1. Once your project is created, go to the project dashboard
2. In the left sidebar, click on "Project Settings" (gear icon)
3. Click on "API" in the settings menu
4. You'll find your project URL and API keys here

## Step 3: Set Up Environment Variables

1. Copy the `.env.local` file in your project, which should have these entries:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. Replace the placeholder values with your actual Supabase credentials:
   - Replace `https://your-project-url.supabase.co` with your actual project URL
   - Replace `your-anon-key` with your `anon` public key
   - Replace `your-service-role-key` with your `service_role` secret key

## Step 4: Set Up Database Tables

You can set up the required database tables in two ways:

### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Click "New Query"
3. Paste the contents of the `supabase-setup.sql` file from this repository
4. Click "Run" to execute the SQL and create the tables

### Option 2: Using Migrations

If you're using Supabase CLI for development:

1. Install the Supabase CLI: `npm install -g supabase`
2. Initialize Supabase in your project: `supabase init`
3. Create a new migration: `supabase migration new initial_schema`
4. Copy the SQL from `supabase-setup.sql` into the generated migration file
5. Apply the migration: `supabase db push`

## Step 5: Test the Connection

1. Run your development server: `npm run dev`
2. Open your application and test the chatbot
3. Check the Supabase dashboard to see if data is being stored in your tables

## Database Schema

The Supabase setup includes the following tables:

### interests

- `id`: UUID (primary key)
- `user_id`: TEXT (user identifier)
- `category`: TEXT (interest category)
- `interest`: TEXT (specific interest)
- `strength`: INTEGER (interest strength, 1-5)
- `created_at`: TIMESTAMP WITH TIME ZONE

### chat_messages

- `id`: UUID (primary key)
- `user_id`: TEXT (user identifier)
- `content`: TEXT (message content)
- `role`: TEXT ('user', 'assistant', or 'system')
- `created_at`: TIMESTAMP WITH TIME ZONE

### user_profiles

- `id`: TEXT (primary key, user identifier)
- `email`: TEXT (user email)
- `major`: TEXT (user's major)
- `year`: INTEGER (user's year in school)
- `interests`: JSONB (JSON containing user interests)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

## Security

The Supabase setup includes Row Level Security (RLS) policies to ensure users can only access their own data. The service role can access all data for administrative purposes.

## Troubleshooting

- **Database Connection Issues**: Make sure your environment variables are correctly set and that your IP address isn't blocked by Supabase.
- **Missing Data**: Check the browser console for errors during data insertion.
- **Authentication Problems**: If using auth, ensure you've set up the auth providers correctly in the Supabase dashboard.

## Advanced: Enabling Authentication

If you want to add authentication to the chatbot:

1. Go to the "Authentication" section in your Supabase dashboard
2. Configure the authentication providers you want to use
3. Update your code to implement login and session management
4. Modify RLS policies as needed

For more information, see the [Supabase Auth documentation](https://supabase.com/docs/guides/auth).
