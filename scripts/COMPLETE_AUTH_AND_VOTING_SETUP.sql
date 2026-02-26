-- ===================================
-- Complete Authentication & Voting Setup
-- ===================================

-- 1. Create voting_status table
CREATE TABLE IF NOT EXISTS public.voting_status (
  id BIGINT PRIMARY KEY DEFAULT 1,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure only one row exists
DELETE FROM public.voting_status WHERE id > 1;

-- Insert default value if not exists
INSERT INTO public.voting_status (id, is_open) 
SELECT 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.voting_status WHERE id = 1);

-- Enable RLS for voting_status
ALTER TABLE public.voting_status ENABLE ROW LEVEL SECURITY;

-- Anyone can read voting status
CREATE POLICY "Anyone can read voting status" ON public.voting_status
  FOR SELECT
  USING (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_voting_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp update
DROP TRIGGER IF EXISTS voting_status_timestamp_trigger ON public.voting_status;
CREATE TRIGGER voting_status_timestamp_trigger
  BEFORE UPDATE ON public.voting_status
  FOR EACH ROW
  EXECUTE FUNCTION update_voting_status_timestamp();

-- 2. Ensure product_votes table has voter_ip_hash unique constraint
-- This prevents multiple votes from the same IP/device
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'product_votes_voter_ip_hash_key'
  ) THEN
    ALTER TABLE public.product_votes ADD UNIQUE (voter_ip_hash);
  END IF;
END
$$;

-- 3. Grant permissions
GRANT ALL ON public.voting_status TO authenticated, anon;
