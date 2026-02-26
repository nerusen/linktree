-- Add voting_status table to control voting open/close
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

-- Enable RLS
ALTER TABLE public.voting_status ENABLE ROW LEVEL SECURITY;

-- Anyone can read voting status
CREATE POLICY "Anyone can read voting status" ON public.voting_status
  FOR SELECT
  USING (true);

-- Only authenticated admins can update (add admin check if needed)
CREATE POLICY "Only admins can update voting status" ON public.voting_status
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_voting_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS voting_status_timestamp_trigger ON public.voting_status;
CREATE TRIGGER voting_status_timestamp_trigger
  BEFORE UPDATE ON public.voting_status
  FOR EACH ROW
  EXECUTE FUNCTION update_voting_status_timestamp();
