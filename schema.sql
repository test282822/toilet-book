-- ============================================================
--  Bathroom Vibes – Supabase SQL Schema
--  Run this in the Supabase SQL editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  full_name   text,
  avatar_url  text,
  bio         text,
  website     text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Posts ─────────────────────────────────────────────────────
create table public.posts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  image_url     text not null,
  image_path    text not null,       -- storage path for deletion
  caption       text,
  rating        smallint not null check (rating between 1 and 5),
  store_name    text,                -- e.g. "Amazon", "Home Depot"
  store_url     text,
  tags          text[] default '{}',
  likes_count   integer default 0 not null,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

alter table public.posts enable row level security;

create policy "Posts are publicly readable"
  on public.posts for select using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- Index for fast feed queries
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_user_id_idx    on public.posts (user_id);

-- ── Likes ─────────────────────────────────────────────────────
create table public.likes (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique (post_id, user_id)
);

alter table public.likes enable row level security;

create policy "Likes are publicly readable"
  on public.likes for select using (true);

create policy "Authenticated users can like"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike their own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Keep likes_count in sync
create or replace function public.handle_like_insert()
returns trigger language plpgsql security definer as $$
begin
  update public.posts set likes_count = likes_count + 1 where id = new.post_id;
  return new;
end;
$$;

create or replace function public.handle_like_delete()
returns trigger language plpgsql security definer as $$
begin
  update public.posts set likes_count = greatest(likes_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

create trigger on_like_insert
  after insert on public.likes
  for each row execute procedure public.handle_like_insert();

create trigger on_like_delete
  after delete on public.likes
  for each row execute procedure public.handle_like_delete();

-- ── Storage bucket ────────────────────────────────────────────
-- Run in Supabase dashboard → Storage → New bucket: "bathroom-pics" (public)
-- Or uncomment below (requires service role):
-- insert into storage.buckets (id, name, public) values ('bathroom-pics', 'bathroom-pics', true);

-- Storage RLS
create policy "Anyone can view bathroom pics"
  on storage.objects for select
  using (bucket_id = 'bathroom-pics');

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'bathroom-pics' and auth.role() = 'authenticated');

create policy "Users can delete their own uploads"
  on storage.objects for delete
  using (bucket_id = 'bathroom-pics' and auth.uid()::text = (storage.foldername(name))[1]);
