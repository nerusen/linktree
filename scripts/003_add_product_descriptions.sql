-- Add description column to farewell_products table
ALTER TABLE public.farewell_products
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing products with sample descriptions
UPDATE public.farewell_products
SET description = CASE 
  WHEN title = 'Minimalist Kit' THEN 'Sleek and minimalist design approach focusing on essential elements and clean aesthetics. Perfect for users who prefer simplicity and functionality without unnecessary decorations.'
  WHEN title = 'Neon Dream' THEN 'Vibrant neon-inspired design with bold colors and contemporary styling. Creates a modern and energetic visual experience that captures attention and inspires creativity.'
  WHEN title = 'Vintage Vibes' THEN 'Retro-inspired design with classic elements and timeless appeal. Combines nostalgic aesthetics with modern functionality for a unique and charming experience.'
  WHEN title = 'Modern Edge' THEN 'Contemporary design with sharp lines and bold contrasts. Represents the intersection of innovation and elegance for forward-thinking users.'
  WHEN title = 'Nature Inspired' THEN 'Organic design elements influenced by natural forms and earthy tones. Creates a calming and harmonious visual experience that connects with nature.'
  WHEN title = 'Bold Statement' THEN 'Strong and assertive design that makes a powerful impression. Emphasizes confidence and personality through dramatic visual choices.'
  WHEN title = 'Sleek Future' THEN 'Futuristic design aesthetic with smooth curves and advanced styling. Represents cutting-edge innovation and tomorrow\'s vision of design excellence.'
  WHEN title = 'Elegant Classic' THEN 'Timeless elegance with refined details and sophisticated styling. Exudes luxury and class through carefully crafted visual elements.'
  ELSE 'A unique and carefully crafted design concept for the Farewell Design collection.'
END
WHERE description IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_farewell_products_order ON public.farewell_products(order);
