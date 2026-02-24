-- Create farewell_products table
CREATE TABLE IF NOT EXISTS public.farewell_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_votes table
CREATE TABLE IF NOT EXISTS public.product_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.farewell_products(id) ON DELETE CASCADE,
  voter_ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_votes_product_id ON public.product_votes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_votes_voter_ip_hash ON public.product_votes(voter_ip_hash);
CREATE INDEX IF NOT EXISTS idx_farewell_products_order ON public.farewell_products("order");

-- Enable Row Level Security
ALTER TABLE public.farewell_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow anonymous public access
CREATE POLICY "Allow public select on farewell_products" ON public.farewell_products
  FOR SELECT USING (true);

CREATE POLICY "Allow public select on product_votes" ON public.product_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on product_votes" ON public.product_votes
  FOR INSERT WITH CHECK (true);

-- Insert 8 sample products
INSERT INTO public.farewell_products (title, image_url, "order") VALUES
  ('Minimalist Kit', 'https://images.unsplash.com/photo-1552662237-6b2d7dcbc4b0?w=500&h=500&fit=crop', 1),
  ('Neon Dream', 'https://images.unsplash.com/photo-1559386914222-35bfb9bb2f7e?w=500&h=500&fit=crop', 2),
  ('Vintage Vibes', 'https://images.unsplash.com/photo-1506755855926-34d408b92f9e?w=500&h=500&fit=crop', 3),
  ('Modern Edge', 'https://images.unsplash.com/photo-1540932239986-a128078bae20?w=500&h=500&fit=crop', 4),
  ('Nature Inspired', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop', 5),
  ('Bold Statement', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop', 6),
  ('Sleek Future', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop', 7),
  ('Elegant Classic', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop', 8);
