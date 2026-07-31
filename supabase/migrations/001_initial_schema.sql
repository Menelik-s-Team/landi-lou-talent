-- Profiles (extends Supabase auth.users)
create type user_role as enum ('admin', 'talent', 'casting_director');

create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role user_role not null default 'talent',
  full_name text,
  created_at timestamptz default now()
);

-- Talent submissions (pre-approval)
create type submission_status as enum ('pending', 'approved', 'rejected');

create table talent_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  dob date not null,
  city text not null,
  state text not null,
  bio text,
  categories text[] not null default '{}',
  instagram text,
  tiktok text,
  youtube text,
  is_minor boolean default false,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  guardian_relationship text,
  headshot_url text,
  portfolio_urls text[] default '{}',
  status submission_status default 'pending',
  admin_notes text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- Talent profiles (post-approval, linked to auth user)
create table talent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  submission_id uuid references talent_submissions(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  dob date,
  city text,
  state text,
  bio text,
  categories text[] default '{}',
  instagram text,
  tiktok text,
  youtube text,
  website text,
  headshot_url text,
  portfolio_urls text[] default '{}',
  is_available boolean default true,
  is_minor boolean default false,
  guardian_name text,
  guardian_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Casting directors
create table casting_directors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  company text,
  title text,
  email text not null,
  phone text,
  created_at timestamptz default now()
);

-- Booking requests
create type booking_status as enum ('requested', 'under_review', 'confirmed', 'declined', 'completed');

create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  casting_director_id uuid references casting_directors(id),
  talent_id uuid references talent_profiles(id),
  project_name text not null,
  project_type text,
  description text,
  date_needed date,
  location text,
  rate text,
  status booking_status default 'requested',
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table talent_submissions enable row level security;
alter table talent_profiles enable row level security;
alter table casting_directors enable row level security;
alter table booking_requests enable row level security;
alter table notifications enable row level security;

-- Profiles: users see their own, admins see all
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Talent submissions: anyone can insert (public form), only admins can read/update
create policy "Public can submit" on talent_submissions for insert with check (true);
create policy "Admins manage submissions" on talent_submissions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Talent profiles: talent sees own, casting directors see available, admins see all
create policy "Talent reads own profile" on talent_profiles for select using (
  user_id = auth.uid()
);
create policy "Casting directors read available talent" on talent_profiles for select using (
  is_available = true and
  exists (select 1 from profiles where id = auth.uid() and role = 'casting_director')
);
create policy "Admins manage talent profiles" on talent_profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Talent updates own profile" on talent_profiles for update using (user_id = auth.uid());

-- Booking requests
create policy "Casting directors manage own requests" on booking_requests for all using (
  casting_director_id = (select id from casting_directors where user_id = auth.uid())
);
create policy "Talent reads own bookings" on booking_requests for select using (
  talent_id = (select id from talent_profiles where user_id = auth.uid())
);
create policy "Admins manage all bookings" on booking_requests for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Notifications
create policy "Users read own notifications" on notifications for select using (user_id = auth.uid());
create policy "Users update own notifications" on notifications for update using (user_id = auth.uid());

-- Trigger: auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger talent_profiles_updated_at before update on talent_profiles
  for each row execute function update_updated_at();

create trigger booking_requests_updated_at before update on booking_requests
  for each row execute function update_updated_at();

-- Auto-create profile on auth signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'talent')::user_role);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
