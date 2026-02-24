-- Updated voting system to support single active vote per user

-- Drop old product_votes table and recreate with new schema
DROP TABLE IF EXISTS public.product_votes CASCADE;

-- Create new product_votes table with voter tracking
CREATE TABLE public.product_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.farewell_products(id) ON DELETE CASCADE,
  voter_ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(voter_ip_hash)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_votes_product_id ON public.product_votes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_votes_voter_ip_hash ON public.product_votes(voter_ip_hash);
CREATE INDEX IF NOT EXISTS idx_farewell_products_order ON public.farewell_products("order");

-- Enable Row Level Security
ALTER TABLE public.product_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow anonymous public access
CREATE POLICY "Allow public select on product_votes" ON public.product_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on product_votes" ON public.product_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on product_votes" ON public.product_votes
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on product_votes" ON public.product_votes
  FOR DELETE USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_votes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_product_votes_updated_at_trigger ON public.product_votes;
CREATE TRIGGER update_product_votes_updated_at_trigger
  BEFORE UPDATE ON public.product_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_product_votes_updated_at();
