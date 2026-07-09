-- User profile collected right after Google sign-in: display name, gender, and the
-- "바다 이름" (sea nickname) the user picks for their personal seaweed-growing space.
-- Additive to 0001/0002; not touched.

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  gender text not null check (gender in ('male', 'female', 'unspecified')),
  sea_name text check (sea_name is null or char_length(sea_name) between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "users can read own profile" on profiles;
create policy "users can read own profile" on profiles
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "users can insert own profile" on profiles;
create policy "users can insert own profile" on profiles
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "users can update own profile" on profiles;
create policy "users can update own profile" on profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
