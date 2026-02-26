-- Migration: Convert voting system from IP-based to email-based
-- This migration changes the product_votes table to use user email as the unique identifier

-- Step 1: Add email column to product_votes table
ALTER TABLE public.product_votes 
ADD COLUMN user_email TEXT;

-- Step 2: Create a unique constraint on (user_email, product_id) 
-- allowing only one vote per email across all products
ALTER TABLE public.product_votes 
ADD CONSTRAINT unique_vote_per_email UNIQUE(user_email);

-- Step 3: Drop old IP-based columns and constraints
ALTER TABLE public.product_votes 
DROP COLUMN IF EXISTS voter_ip_hash;

-- Step 4: Make user_email NOT NULL
ALTER TABLE public.product_votes 
ALTER COLUMN user_email SET NOT NULL;

-- Step 5: Update RLS policies for email-based voting

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to update their votes" ON public.product_votes;
DROP POLICY IF EXISTS "Allow users to read their votes" ON public.product_votes;
DROP POLICY IF EXISTS "Allow anonymous vote insert" ON public.product_votes;
DROP POLICY IF EXISTS "Allow public delete on product_votes" ON public.product_votes;
DROP POLICY IF EXISTS "Allow public update on product_votes" ON public.product_votes;
DROP POLICY IF EXISTS "Allow public insert on product_votes" ON public.product_votes;
DROP POLICY IF EXISTS "Allow public select on product_votes" ON public.product_votes;

-- Create new email-based RLS policies
CREATE POLICY "Allow authenticated users to insert votes"
ON public.product_votes FOR INSERT
WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Allow authenticated users to select their votes"
ON public.product_votes FOR SELECT
USING (user_email = auth.jwt() ->> 'email' OR true);

CREATE POLICY "Allow authenticated users to update their votes"
ON public.product_votes FOR UPDATE
USING (user_email = auth.jwt() ->> 'email')
WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Allow authenticated users to delete their votes"
ON public.product_votes FOR DELETE
USING (user_email = auth.jwt() ->> 'email');

-- Step 6: Create index on user_email for faster queries
CREATE INDEX idx_product_votes_user_email ON public.product_votes(user_email);
CREATE INDEX idx_product_votes_product_id ON public.product_votes(product_id);
