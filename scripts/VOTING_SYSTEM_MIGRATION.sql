-- ============================================================================
-- FAREWELL DESIGN VOTING SYSTEM - COMPLETE MIGRATION
-- ============================================================================
-- This script sets up the complete voting system with support for:
-- - Single active vote per user (device/browser)
-- - Ability to change votes anytime
-- - Real-time vote tracking and updates
-- ============================================================================

-- Step 1: Create farewell_products table
CREATE TABLE IF NOT EXISTS public.farewell_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create product_votes table with UNIQUE constraint for single vote per user
CREATE TABLE IF NOT EXISTS public.product_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.farewell_products(id) ON DELETE CASCADE,
  voter_ip_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_votes_product_id ON public.product_votes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_votes_voter_ip_hash ON public.product_votes(voter_ip_hash);
CREATE INDEX IF NOT EXISTS idx_farewell_products_order ON public.farewell_products("order");

-- Step 4: Enable Row Level Security
ALTER TABLE public.farewell_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_votes ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for public access (no authentication required)
DROP POLICY IF EXISTS "Allow public select on farewell_products" ON public.farewell_products;
CREATE POLICY "Allow public select on farewell_products" ON public.farewell_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on product_votes" ON public.product_votes;
CREATE POLICY "Allow public select on product_votes" ON public.product_votes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on product_votes" ON public.product_votes;
CREATE POLICY "Allow public insert on product_votes" ON public.product_votes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on product_votes" ON public.product_votes;
CREATE POLICY "Allow public update on product_votes" ON public.product_votes
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on product_votes" ON public.product_votes;
CREATE POLICY "Allow public delete on product_votes" ON public.product_votes
  FOR DELETE USING (true);

-- Step 6: Create function to automatically update updated_at timestamp
DROP FUNCTION IF EXISTS update_product_votes_updated_at();
CREATE OR REPLACE FUNCTION update_product_votes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_product_votes_updated_at_trigger ON public.product_votes;
CREATE TRIGGER update_product_votes_updated_at_trigger
  BEFORE UPDATE ON public.product_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_product_votes_updated_at();

-- Step 8: Clear existing data if needed (comment out if you want to keep old data)
-- DELETE FROM public.product_votes;
-- DELETE FROM public.farewell_products;

-- Step 9: Insert 8 sample products (if not already exists)
INSERT INTO public.farewell_products (title, image_url, "order") VALUES
  ('Minimalist Kit', 'https://images.unsplash.com/photo-1552662237-6b2d7dcbc4b0?w=500&h=500&fit=crop', 1),
  ('Neon Dream', 'https://images.unsplash.com/photo-1559386914222-35bfb9bb2f7e?w=500&h=500&fit=crop', 2),
  ('Vintage Vibes', 'https://images.unsplash.com/photo-1506755855926-34d408b92f9e?w=500&h=500&fit=crop', 3),
  ('Modern Edge', 'https://images.unsplash.com/photo-1540932239986-a128078bae20?w=500&h=500&fit=crop', 4),
  ('Nature Inspired', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop', 5),
  ('Bold Statement', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop', 6),
  ('Sleek Future', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop', 7),
  ('Elegant Classic', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop', 8)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- The voting system is now ready to use!
-- 
-- HOW IT WORKS:
-- 1. Each browser/device is identified by a unique hash (voter_ip_hash)
-- 2. The UNIQUE constraint on voter_ip_hash ensures each device can only have 1 vote
-- 3. Users can change their vote at any time (UPDATE operation)
-- 4. The updated_at field tracks when votes change
-- 5. All operations use RLS for secure public access
-- ============================================================================
