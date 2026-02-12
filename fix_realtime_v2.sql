-- 1. Set Replica Identity to FULL
-- This ensures that UPDATE events contain all columns, which is necessary for the realtime subscription to work correctly.
-- This was likely skipped in the previous run due to the error.
alter table public.stores replica identity full;

-- 2. Explicitly grant select permission to authenticated users (just to be sure)
grant select on table public.stores to authenticated;

-- 3. Verify Publication (The user confirmed 'stores' is already in 'supabase_realtime', so we skip adding it to avoid error)

-- 4. Reload schema cache
notify pgrst, 'reload schema';
