# Email-Based Voting System Setup Guide

## Overview
This guide explains how to migrate from IP-based voting to email-based voting, ensuring 1 email = 1 vote and authenticated users only.

## What Changed

### Before (IP-Based)
- Used `voter_ip_hash` to track votes
- Multiple people on same network = 1 vote
- Anonymous voting allowed
- Unreliable vote tracking

### After (Email-Based)
- Uses `user_email` from authenticated Supabase users
- Exactly 1 vote per email address
- Only authenticated users can vote
- Reliable and verifiable voting system

## Step 1: Run the SQL Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire content from: `scripts/006_migrate_to_email_based_voting.sql`
3. Click "Run" to execute

**What this migration does:**
- Adds `user_email` column to `product_votes` table
- Removes old `voter_ip_hash` column
- Creates UNIQUE constraint on `user_email` (only 1 vote per email)
- Updates RLS policies for email-based authentication
- Creates indexes for better performance

## Step 2: Verify Database Changes

After migration, verify in Supabase:

1. Go to Table Editor → `product_votes`
2. Check that columns show:
   - `id` (UUID)
   - `product_id` (UUID)
   - `user_email` (TEXT, NOT NULL)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. Check constraints:
   - UNIQUE constraint on `user_email` should exist
   - This ensures only 1 vote per email

## Step 3: Code Updates (Already Done)

The following code changes have been made:

### `app/voting/page.tsx`
- Changed from `clientId` (IP hash) to `userEmail`
- Now requires authentication to vote
- Fetches user email from `supabase.auth.getUser()`
- All vote operations use `user_email` instead of `voter_ip_hash`

### `components/voters-avatar-group.tsx`
- Updated to query votes by `user_email`
- Displays avatars of authenticated voters

## Step 4: How It Works Now

### Voting Flow:
1. User clicks "Login" button
2. User authenticates with Google
3. System stores their email from OAuth
4. User can vote (button now enabled)
5. Vote is recorded with their email
6. User can change vote anytime (updates existing vote)
7. Only 1 vote per email across all products

### Database Query Examples:

Get all votes:
```sql
SELECT user_email, product_id FROM product_votes;
```

Check if specific user has voted:
```sql
SELECT product_id FROM product_votes 
WHERE user_email = 'user@example.com';
```

Change a user's vote:
```sql
UPDATE product_votes 
SET product_id = 'new-product-id' 
WHERE user_email = 'user@example.com';
```

Remove a user's vote:
```sql
DELETE FROM product_votes 
WHERE user_email = 'user@example.com';
```

## Step 5: Testing

1. **Test as Unauthenticated User:**
   - Try to click vote button
   - Should see: "Silakan login terlebih dahulu untuk melakukan voting"
   - Vote button should be disabled

2. **Test as Authenticated User:**
   - Login with Google
   - Vote buttons should now be enabled
   - Click vote button
   - Vote should be recorded in database

3. **Test Vote Change:**
   - Vote for Product A
   - Vote for Product B
   - Check database: only 1 vote record exists for that email with Product B

4. **Test Second User:**
   - Logout
   - Login with different Google account
   - Should be able to vote (different email)
   - Vote count should increase

## Step 6: Monitoring Votes

View active voters in Supabase:
```sql
SELECT user_email, product_id, created_at, updated_at 
FROM product_votes 
ORDER BY updated_at DESC;
```

View vote count per product:
```sql
SELECT product_id, COUNT(*) as vote_count 
FROM product_votes 
GROUP BY product_id 
ORDER BY vote_count DESC;
```

## RLS Security Policies

The following RLS policies are now in place:

1. **INSERT**: Only authenticated users with their own email
2. **SELECT**: Any user can view all votes (public display)
3. **UPDATE**: Only authenticated users can update their own vote
4. **DELETE**: Only authenticated users can delete their own vote

This ensures:
- No email spoofing
- No unauthorized modifications
- Transparent voting display

## Troubleshooting

### "Voting button is still disabled after login"
- Check browser console for auth errors
- Verify user has email in their Google account
- Try logging out and logging back in

### "Getting unique constraint violation error"
- This means user already has a vote
- Update operation should handle this - just vote for a different product
- If stuck, contact admin to delete their vote

### "RLS policy error when voting"
- Ensure you ran the migration completely
- Check that new RLS policies exist in Supabase
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct

## Migration Rollback (If Needed)

If you need to revert to IP-based voting:

```sql
-- Add back voter_ip_hash column
ALTER TABLE product_votes ADD COLUMN voter_ip_hash TEXT;

-- Restore old constraints
ALTER TABLE product_votes DROP CONSTRAINT unique_vote_per_email;

-- Remove email column
ALTER TABLE product_votes DROP COLUMN user_email;
```

However, this is not recommended as it loses user authentication data.

## Conclusion

Your voting system now:
✅ Only allows authenticated users  
✅ Enforces 1 vote per email  
✅ Uses secure email-based tracking  
✅ Prevents vote fraud from multiple accounts  
✅ Maintains vote change functionality  

For questions or issues, check the debug logs in browser console.
