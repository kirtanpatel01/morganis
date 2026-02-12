-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL, -- Removed CHECK constraint to allow future types (order, payment, etc.)
  data jsonb NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can update their own notifications (e.g., mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to insert notifications (e.g. Super Admin notifying Store Owner)
CREATE POLICY "Authenticated users can insert notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for notifications table
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.notifications;
commit;
