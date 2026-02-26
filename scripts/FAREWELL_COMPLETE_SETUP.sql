-- ============================================================
-- FAREWELL DESIGN VOTING SYSTEM - COMPLETE SETUP
-- This file includes all necessary tables, RLS policies, and sample data
-- ============================================================

-- ============================================================
-- 1. Create farewell_products table (if not exists)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.farewell_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  "order" INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- ============================================================
-- 2. Create product_votes table (if not exists)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.farewell_products(id) ON DELETE CASCADE,
  voter_ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  UNIQUE(voter_ip_hash)
);

-- ============================================================
-- 3. Add description column to farewell_products (if not exists)
-- ============================================================
ALTER TABLE public.farewell_products
ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================================
-- 4. Set up Row Level Security (RLS)
-- ============================================================
-- Enable RLS on both tables
ALTER TABLE public.farewell_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to products" ON public.farewell_products;
DROP POLICY IF EXISTS "Allow anonymous vote insert" ON public.product_votes;
DROP POLICY IF EXISTS "Allow users to read their votes" ON public.product_votes;
DROP POLICY IF EXISTS "Allow users to update their votes" ON public.product_votes;

-- Create new policies
CREATE POLICY "Allow public read access to products" ON public.farewell_products
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow anonymous vote insert" ON public.product_votes
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow users to read their votes" ON public.product_votes
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow users to update their votes" ON public.product_votes
  FOR UPDATE USING (TRUE);

-- ============================================================
-- 5. Create indexes for better performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_farewell_products_order ON public.farewell_products("order");
CREATE INDEX IF NOT EXISTS idx_product_votes_product_id ON public.product_votes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_votes_voter_hash ON public.product_votes(voter_ip_hash);

-- ============================================================
-- 6. Clear existing data (optional - comment out if you want to keep existing data)
-- ============================================================
-- TRUNCATE TABLE public.product_votes CASCADE;
-- TRUNCATE TABLE public.farewell_products CASCADE;

-- ============================================================
-- 7. Insert sample products with descriptions
-- ============================================================
-- Delete existing products with these titles first
DELETE FROM public.farewell_products 
WHERE title IN (
  'Minimalist Kit', 'Neon Dream', 'Vintage Vibes', 'Modern Edge',
  'Nature Inspired', 'Bold Statement', 'Sleek Future', 'Elegant Classic'
);

-- Insert new products with descriptions
INSERT INTO public.farewell_products (title, image_url, description, "order") VALUES
(
  'Minimalist Kit',
  'https://images.unsplash.com/photo-1552662237-6b2d7dcbc4b0?w=500&h=500&fit=crop',
  'Sleek and minimalist design approach focusing on essential elements and clean aesthetics. Perfect for users who prefer simplicity and functionality without unnecessary decorations. Every element serves a purpose, creating a distraction-free experience.',
  1
),
(
  'Neon Dream',
  'https://images.unsplash.com/photo-1559386914222-35bfb9bb2f7e?w=500&h=500&fit=crop',
  'Vibrant neon-inspired design with bold colors and contemporary styling. Creates a modern and energetic visual experience that captures attention and inspires creativity. Perfect for those who want to make a statement.',
  2
),
(
  'Vintage Vibes',
  'https://images.unsplash.com/photo-1506755855926-34d408b92f9e?w=500&h=500&fit=crop',
  'Retro-inspired design with classic elements and timeless appeal. Combines nostalgic aesthetics with modern functionality for a unique and charming experience. Brings warmth and character to your digital space.',
  3
),
(
  'Modern Edge',
  'https://images.unsplash.com/photo-1540932239986-a128078bae20?w=500&h=500&fit=crop',
  'Contemporary design with sharp lines and bold contrasts. Represents the intersection of innovation and elegance for forward-thinking users. Clean geometry meets sophisticated color palette.',
  4
),
(
  'Nature Inspired',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop',
  'Organic design elements influenced by natural forms and earthy tones. Creates a calming and harmonious visual experience that connects with nature. Perfect for those seeking balance and tranquility.',
  5
),
(
  'Bold Statement',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
  'Strong and assertive design that makes a powerful impression. Emphasizes confidence and personality through dramatic visual choices. For users who aren''t afraid to stand out.',
  6
),
(
  'Sleek Future',
  'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop',
  'Futuristic design aesthetic with smooth curves and advanced styling. Represents cutting-edge innovation and tomorrow''s vision of design excellence. Blends technology with elegance.',
  7
),
(
  'Elegant Classic',
  'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop',
  'Timeless elegance with refined details and sophisticated styling. Exudes luxury and class through carefully crafted visual elements. A choice for those who appreciate the finer things.',
  8
);

-- ============================================================
-- 8. Verify setup
-- ============================================================
-- Count products
SELECT COUNT(*) as product_count FROM public.farewell_products;

-- Count votes
SELECT COUNT(*) as vote_count FROM public.product_votes;

-- View all products with descriptions
SELECT id, title, "order", description FROM public.farewell_products ORDER BY "order" ASC;
