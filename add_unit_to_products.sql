-- Add unit column to products table
ALTER TABLE public.products ADD COLUMN unit text NOT NULL DEFAULT 'pcs';

-- Comment on column
COMMENT ON COLUMN public.products.unit IS 'Unit of measurement for the product (e.g., pcs, kg, liter)';
