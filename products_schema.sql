-- Create categories table
create table public.categories (
  id uuid not null default gen_random_uuid (),
  store_id uuid not null,
  name text not null,
  created_at timestamp with time zone not null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_store_id_fkey foreign key (store_id) references public.stores (id) on delete cascade
) tablespace pg_default;

-- Create products table
create table public.products (
  id uuid not null default gen_random_uuid (),
  store_id uuid not null,
  category_id uuid null,
  name text not null,
  description text null,
  price decimal(10, 2) not null default 0.00,
  stock integer not null default 0,
  image_url text null,
  status text not null default 'active', -- active, archived, draft
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint products_pkey primary key (id),
  constraint products_store_id_fkey foreign key (store_id) references public.stores (id) on delete cascade,
  constraint products_category_id_fkey foreign key (category_id) references public.categories (id) on delete set null
) tablespace pg_default;

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Policies for categories
create policy "Public categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Admins can insert categories for their store"
  on public.categories for insert
  with check (
    auth.uid() in (
      select admin_id from public.stores where id = store_id
    )
  );

create policy "Admins can update categories for their store"
  on public.categories for update
  using (
    auth.uid() in (
      select admin_id from public.stores where id = store_id
    )
  );

create policy "Admins can delete categories for their store"
  on public.categories for delete
  using (
    auth.uid() in (
      select admin_id from public.stores where id = store_id
    )
  );

-- Policies for products
create policy "Public products are viewable by everyone"
  on public.products for select
  using (true);

create policy "Admins can insert products for their store"
  on public.products for insert
  with check (
    auth.uid() in (
      select admin_id from public.stores where id = store_id
    )
  );

create policy "Admins can update products for their store"
  on public.products for update
  using (
    auth.uid() in (
      select admin_id from public.stores where id = store_id
    )
  );

create policy "Admins can delete products for their store"
  on public.products for delete
  using (
    auth.uid() in (
      select admin_id from public.stores where id = store_id
    )
  );

-- Realtime
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.products;
