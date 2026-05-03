-- ============================================================
--  Bathroom Vibes – Migration v2
--  Run this in the Supabase SQL Editor
-- ============================================================

-- ── Add moderation_status to posts ───────────────────────────
alter table public.posts
  add column if not exists moderation_status text not null default 'approved'
  check (moderation_status in ('pending', 'approved', 'rejected'));

-- Index so we can filter feed by approved posts only
create index if not exists posts_moderation_idx
  on public.posts (moderation_status);

-- ── Reports table ─────────────────────────────────────────────
create table if not exists public.reports (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  reason     text,
  created_at timestamptz default now() not null,
  unique (post_id, user_id)          -- one report per user per post
);

alter table public.reports enable row level security;

create policy "Authenticated users can report posts"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users can see their own reports"
  on public.reports for select
  using (auth.uid() = user_id);
