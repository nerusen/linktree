# Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication for the Farewell Design voting application.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Farewell Design Voting")
5. Click "Create"
6. Wait for the project to be created and select it

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and then click "Enable"
4. Wait for it to enable (this may take a few moments)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, click "Configure Consent Screen" first:
   - Select "External" user type
   - Click "Create"
   - Fill in the required fields:
     - App name: "Farewell Design Voting"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - In "Scopes" section, click "Save and Continue"
   - In "Test users" section, click "Save and Continue"
   - Review and click "Back to Dashboard"

4. Now create the OAuth credentials:
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Under "Authorized JavaScript origins", add:
     - `http://localhost:3000` (for local development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Under "Authorized redirect URIs", add:
     - `http://localhost:3000/auth/callback` (for local development)
     - `https://yourdomain.com/auth/callback` (for production)
     - Also add your Supabase callback URL: `https://[PROJECT_ID].supabase.co/auth/v1/callback`
   - Click "Create"

5. Copy the generated credentials (you'll see Client ID and Client Secret)

## Step 4: Configure Supabase with Google OAuth

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" > "Providers"
4. Find "Google" and click it
5. Enable Google by clicking the toggle
6. Paste your Google OAuth credentials:
   - **Client ID**: From Step 3
   - **Client Secret**: From Step 3
7. Click "Save"

## Step 5: Update Environment Variables

Add the following environment variables to your `.env.local` file (for local development):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should already be configured if you've set up Supabase.

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Sign in with Google"

4. You should be redirected to Google's login page

5. After authenticating, you should be redirected back to the voting page

## Step 7: Deploy to Production

When deploying to production:

1. Update your Google OAuth credentials with your production domain
2. Ensure your redirect URIs match your production domain
3. Add your production domain to Google Cloud Console's authorized origins

## Troubleshooting

### "Invalid Client ID" Error
- Verify the Client ID is correctly copied from Google Cloud Console
- Ensure the Client ID matches in both Supabase and Google Cloud Console
- Check that your domain is added to "Authorized JavaScript origins"

### "Redirect URI mismatch" Error
- Verify that your callback URL is exactly as specified in Google Cloud Console
- Check that `http://localhost:3000/auth/callback` is added for local development
- For production, ensure `https://yourdomain.com/auth/callback` is added

### User not found after login
- The user profile table (`user_profiles`) is automatically created via the migration script
- Run the SQL migration: `scripts/004_add_user_profiles.sql` in Supabase
- Ensure RLS policies are properly configured

### Avatar not showing
- Google sometimes doesn't return the avatar URL
- The app will display the user's initial in a colored circle as a fallback
- The avatar URL can be manually updated later

## Database Setup

Make sure you've run the user profiles migration:

1. Go to Supabase Dashboard > SQL Editor
2. Run the SQL from `scripts/004_add_user_profiles.sql`
3. This creates the `user_profiles` table and sets up automatic user profile creation

## Features

After authentication is set up:

- Users can sign in with their Google account
- User profiles are automatically created with their Google information
- Login/logout buttons appear in the top right corner
- User avatar and username display in the header
- Click the avatar to see a dropdown with user info and logout button
- Backdrop blur effect appears when the dropdown is open
- Voted users' avatars appear below the vote counter (max 5, with "+X others" for the rest)

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for sensitive credentials
- Supabase handles OAuth token management securely
- User data is protected with Row Level Security (RLS) policies
