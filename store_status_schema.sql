-- Add status column to stores if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'stores' and column_name = 'status') then
        alter table public.stores add column status text not null default 'pending';
    end if;
end $$;

-- Enable realtime for stores
alter publication supabase_realtime add table public.stores;

-- Update RLS for stores to ensure admins can read their own store status based on admin_id
-- We assume existing RLS exists. If not, you might need to enable it and add policies.

-- Policy for public to read active stores (needed for public products join)
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'stores' and policyname = 'Public can view active stores') then
        create policy "Public can view active stores"
          on public.stores for select
          using (status = 'active');
    end if;
end $$;

-- Policy for Admins to view their own store
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'stores' and policyname = 'Admins can view own store') then
        create policy "Admins can view own store"
          on public.stores for select
          to authenticated
          using (auth.uid() = admin_id);
    end if;
end $$;


-- Set replica identity to full to ensure all columns are available in realtime payload
alter table public.stores replica identity full;
