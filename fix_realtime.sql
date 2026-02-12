-- 1. Ensure the store status column exists (safeguard)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'stores' and column_name = 'status') then
        alter table public.stores add column status text not null default 'pending';
    end if;
end $$;

-- 2. CRITICAL: Add stores to the realtime publication
-- This is often the missed step for new tables.
alter publication supabase_realtime add table public.stores;

-- 3. CRITICAL: Set Replica Identity to FULL
-- This ensures that UPDATE events contain enough information for listeners to filter by ID (and see changed fields correctly)
alter table public.stores replica identity full;

-- 4. Verify RLS Policies (User provided ones look okay for read `using (true)`, but we ensure strictness)
-- No changes needed to policies if "Enable read access for all users" using (true) exists. 
-- It allows the realtime subscription to succeed for any authenticated/anon user.

-- 5. Force a schema cache reload (sometimes needed)
notify pgrst, 'reload schema';
