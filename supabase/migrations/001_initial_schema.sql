-- ============================================================
-- WaitlistPro — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Extensions
-- ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- Custom types
-- ────────────────────────────────────────────────────────────
create type public.plan_type as enum ('free', 'pro', 'business');
create type public.subscriber_status as enum ('waiting', 'confirmed', 'invited');

-- ────────────────────────────────────────────────────────────
-- Helper: generate a short random referral code
-- ────────────────────────────────────────────────────────────
create or replace function public.generate_referral_code()
returns text
language sql
as $$
  select upper(substring(encode(gen_random_bytes(6), 'hex') from 1 for 8));
$$;

-- ============================================================
-- TABLE: profiles
-- Mirrors auth.users 1-to-1. Created automatically via trigger.
-- ============================================================
create table public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  email                  text not null,
  full_name              text,
  plan                   public.plan_type not null default 'free',
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  created_at             timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- Trigger: auto-create profile on new auth user
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TABLE: waitlists
-- ============================================================
create table public.waitlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  description text,
  settings    jsonb not null default '{
    "color": "#18181b",
    "logo_url": null,
    "redirect_url": null,
    "custom_fields": [],
    "referral_enabled": true
  }'::jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLE: subscribers
-- ============================================================
create table public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  waitlist_id   uuid not null references public.waitlists(id) on delete cascade,
  email         text not null,
  position      integer not null,
  referral_code text not null unique default public.generate_referral_code(),
  referred_by   uuid references public.subscribers(id) on delete set null,
  status        public.subscriber_status not null default 'waiting',
  created_at    timestamptz not null default now(),
  unique (waitlist_id, email)
);

-- ============================================================
-- TABLE: referrals
-- ============================================================
create table public.referrals (
  id          uuid primary key default gen_random_uuid(),
  waitlist_id uuid not null references public.waitlists(id) on delete cascade,
  referrer_id uuid not null references public.subscribers(id) on delete cascade,
  referee_id  uuid not null references public.subscribers(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (referrer_id, referee_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
-- profiles
create index idx_profiles_stripe_customer   on public.profiles(stripe_customer_id);
create index idx_profiles_stripe_sub        on public.profiles(stripe_subscription_id);

-- waitlists
create index idx_waitlists_user_id          on public.waitlists(user_id);
create index idx_waitlists_slug             on public.waitlists(slug);
create index idx_waitlists_is_active        on public.waitlists(is_active);

-- subscribers
create index idx_subscribers_waitlist_id    on public.subscribers(waitlist_id);
create index idx_subscribers_email          on public.subscribers(email);
create index idx_subscribers_referral_code  on public.subscribers(referral_code);
create index idx_subscribers_referred_by    on public.subscribers(referred_by);
create index idx_subscribers_status         on public.subscribers(status);
create index idx_subscribers_position       on public.subscribers(waitlist_id, position);

-- referrals
create index idx_referrals_waitlist_id      on public.referrals(waitlist_id);
create index idx_referrals_referrer_id      on public.referrals(referrer_id);
create index idx_referrals_referee_id       on public.referrals(referee_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "profiles: owner can read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner can update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Service role (used by webhook handler) bypasses RLS by default.
-- No additional insert/delete policies needed — handle_new_user()
-- runs as SECURITY DEFINER so it bypasses RLS on insert.

-- ────────────────────────────────────────────────────────────
-- waitlists
-- ────────────────────────────────────────────────────────────
alter table public.waitlists enable row level security;

create policy "waitlists: owner can read"
  on public.waitlists for select
  using (auth.uid() = user_id);

create policy "waitlists: public can read active"
  on public.waitlists for select
  using (is_active = true);

create policy "waitlists: owner can insert"
  on public.waitlists for insert
  with check (auth.uid() = user_id);

create policy "waitlists: owner can update"
  on public.waitlists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "waitlists: owner can delete"
  on public.waitlists for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- subscribers
-- ────────────────────────────────────────────────────────────
alter table public.subscribers enable row level security;

-- Anyone can join a waitlist (public insert)
create policy "subscribers: public can insert"
  on public.subscribers for insert
  with check (
    exists (
      select 1 from public.waitlists
      where id = waitlist_id
        and is_active = true
    )
  );

-- Only the waitlist owner can read subscribers
create policy "subscribers: owner can read"
  on public.subscribers for select
  using (
    exists (
      select 1 from public.waitlists
      where id = waitlist_id
        and user_id = auth.uid()
    )
  );

-- Only the waitlist owner can update subscriber status
create policy "subscribers: owner can update"
  on public.subscribers for update
  using (
    exists (
      select 1 from public.waitlists
      where id = waitlist_id
        and user_id = auth.uid()
    )
  );

-- Only the waitlist owner can delete subscribers
create policy "subscribers: owner can delete"
  on public.subscribers for delete
  using (
    exists (
      select 1 from public.waitlists
      where id = waitlist_id
        and user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- referrals
-- ────────────────────────────────────────────────────────────
alter table public.referrals enable row level security;

-- Public insert: referral is created server-side when a subscriber signs up
-- via the API route (which uses service role or anon key with proper context).
create policy "referrals: public can insert"
  on public.referrals for insert
  with check (
    exists (
      select 1 from public.waitlists
      where id = waitlist_id
        and is_active = true
    )
  );

-- Only the waitlist owner can read referrals
create policy "referrals: owner can read"
  on public.referrals for select
  using (
    exists (
      select 1 from public.waitlists
      where id = waitlist_id
        and user_id = auth.uid()
    )
  );
