'use server'

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function signupAdmin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const headersList = await headers()
  const origin = headersList.get("origin")
  
  if (!email || !password || !fullName) {
    return { error: "Missing required fields" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/admin`,
      data: {
        full_name: fullName,
        role: "admin",
      },
    },
  })

  // IMPORTANT: 
  // You must create a Database Trigger to automatically create a profile entry.
  // Run this SQL in your Supabase SQL Editor:
  /*
  -- 1. Create profiles table
  create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    updated_at timestamp with time zone,
    full_name text,
    role text default 'user',
    email text
  );

  -- 2. Turn on RLS
  alter table public.profiles enable row level security;
  
  -- 3. Create policies (example)
  create policy "Public profiles are viewable by everyone." on profiles for select using (true);
  create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
  create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

  -- 4. Create function to handle new user
  create or replace function public.handle_new_user() 
  returns trigger as $$
  begin
    insert into public.profiles (id, full_name, role, email)
    values (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      coalesce(new.raw_user_meta_data->>'role', 'user'),
      new.email
    );
    return new;
  end;
  $$ language plpgsql security definer;

  -- 5. Trigger the function every time a user is created
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  */

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
