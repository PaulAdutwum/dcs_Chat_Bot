# Beginner's Guide to Supabase Setup for DCS Chatbot

This step-by-step guide will help you set up and test Supabase for the DCS Chatbot, even if you've never used Supabase before.

## What is Supabase?

Supabase is an open-source Firebase alternative. It provides:

- A PostgreSQL database
- Authentication
- Auto-generated APIs
- Real-time subscriptions
- Storage
- Analytics

## Step 1: Access Your Supabase Project

You already have credentials in your `.env.local` file, so you likely have a Supabase project set up. Here's how to access it:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Sign in with your account
3. Look for a project with this URL: `https://chutjphlqxokijzsqrwn.supabase.co`
4. If you don't see it, you might need to ask whoever set up the project for access

## Step 2: Create the Database Table

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click on **+ New Query**
3. Copy and paste the entire SQL code from this file:
   ```
   /Users/pauladutwum/Documents/Myprojects/dcsbot/supabase/migrations/20231108000000_create_user_interactions.sql
   ```
4. Click the **Run** button (green triangle)
5. You should see a success message

The SQL will create a table called `user_interactions` that will store all chat data.

## Step 3: Check If the Table Was Created

1. Click on **Table Editor** in the left sidebar
2. You should see `user_interactions` in your list of tables
3. Click on it to view its structure

## Step 4: Start Your Application

1. Open your terminal
2. Navigate to your project folder:
   ```bash
   cd /Users/pauladutwum/Documents/Myprojects/dcsbot
   ```
3. Start your development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Step 5: Test the Integration

1. Open your application in a web browser (usually at http://localhost:3000)
2. Open browser developer tools:
   - **Chrome**: Press F12 or right-click and select "Inspect"
   - **Safari**: Enable developer tools in Safari preferences, then right-click and select "Inspect Element"
   - **Firefox**: Press F12 or right-click and select "Inspect Element"
3. Go to the "Console" tab in developer tools
4. Interact with the chatbot:
   - Send some messages
   - Click suggestion buttons
   - Try to contact a professor
5. Look for console messages saying "Successfully logged to Supabase"

## Step 6: View the Data in Supabase

1. Go back to your Supabase dashboard
2. Click on **Table Editor** in the left sidebar
3. Select the `user_interactions` table
4. Click **Refresh** to see new data
5. You should see entries for each interaction you made

## Understanding the Supabase Implementation

### How Data is Sent to Supabase

In our code, we use these functions to send data to Supabase:

1. `logUserInteraction` - Generic function that logs any user activity
2. `handleEmailSubmit` - Specifically for logging professor contact requests

The actual database call looks like this:

```javascript
const { data, error } = await supabase.from("user_interactions").insert({
  user_id: userId,
  interaction_type: interactionType,
  content: content,
  created_at: new Date().toISOString(),
});
```

### What Data is Being Stored

We store:

- **User messages**: What the user types in the chat
- **Button clicks**: Which suggestion buttons the user clicks
- **Professor contacts**: When a user asks to contact a professor

### Privacy and Security

- We use anonymous IDs for users, not personal information
- We have Row Level Security policies that control data access
- The Supabase anon key only allows specific operations

## Moving to a Different GitHub Repository

If you want to track these files in your own GitHub repository:

1. Create a new repository on GitHub
2. Initialize Git in your project if not already done:
   ```bash
   git init
   ```
3. Add your remote repository:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
4. Add and commit your files:
   ```bash
   git add .
   git commit -m "Initial commit with Supabase integration"
   ```
5. Push to your repository:
   ```bash
   git push -u origin main
   ```

## Learning More About Supabase

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/start)
- [Supabase with Next.js](https://supabase.io/docs/guides/with-nextjs)

## Troubleshooting

- **"Error connecting to Supabase"**: Check your internet connection and make sure your anon key is correct
- **"No access to this resource"**: Check RLS policies in Supabase
- **"Table doesn't exist"**: Make sure you ran the SQL migration correctly

Happy coding! 🚀
