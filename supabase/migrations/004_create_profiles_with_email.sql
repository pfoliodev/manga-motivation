-- Create a table for public profiles (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  notifications_enabled boolean default false,
  notification_time time default '09:00:00',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add email and created_at columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'email') THEN
    ALTER TABLE public.profiles ADD COLUMN email text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'created_at') THEN
    ALTER TABLE public.profiles ADD COLUMN created_at timestamp with time zone default timezone('utc'::text, now()) not null;
  END IF;
END $$;

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create profile for existing users who don't have one
insert into public.profiles (id, email, full_name, avatar_url)
select 
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name'),
  coalesce(au.raw_user_meta_data->>'avatar_url', au.raw_user_meta_data->>'picture')
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
);
