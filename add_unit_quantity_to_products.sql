-- Add unit_quantity column to products table
ALTER TABLE public.products ADD COLUMN unit_quantity integer NOT NULL DEFAULT 1;

-- Comment on column
COMMENT ON COLUMN public.products.unit_quantity IS 'Number of items per unit (e.g., 6 for 6 momos per plate)';
