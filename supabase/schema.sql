-- TopCollec Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  avatar_url text,
  role text default 'author', -- 'author' | 'admin'
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Posts table
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  content_type text default 'markdown', -- 'markdown' | 'html'
  featured_image text,
  status text default 'draft', -- 'draft' | 'published' | 'archived'
  published_at timestamptz,
  reading_time integer,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on posts
alter table posts enable row level security;

-- Posts policies
create policy "Published posts are viewable by everyone"
  on posts for select
  using (status = 'published' or auth.uid() = author_id);

create policy "Authors can create posts"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on posts for update
  using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- Tags table
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Enable RLS on tags
alter table tags enable row level security;

-- Tags policies
create policy "Tags are viewable by everyone"
  on tags for select
  using (true);

create policy "Authenticated users can create tags"
  on tags for insert
  with check (auth.role() = 'authenticated');

-- Post-Tags junction table
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Enable RLS on post_tags
alter table post_tags enable row level security;

-- Post-tags policies
create policy "Post tags are viewable by everyone"
  on post_tags for select
  using (true);

create policy "Authors can manage post tags"
  on post_tags for all
  using (
    exists (
      select 1 from posts
      where posts.id = post_id
      and posts.author_id = auth.uid()
    )
  );

-- Comments table
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_name text,
  author_email text,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  is_approved boolean default false,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamptz default now()
);

-- Enable RLS on comments
alter table comments enable row level security;

-- Comments policies
create policy "Approved comments are viewable by everyone"
  on comments for select
  using (is_approved = true or auth.uid() = author_id);

create policy "Anyone can create comments"
  on comments for insert
  with check (true);

create policy "Comment authors can update own comments"
  on comments for update
  using (auth.uid() = author_id);

-- Bookmarks table (optional feature)
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- Enable RLS on bookmarks
alter table bookmarks enable row level security;

-- Bookmarks policies
create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Full-text search setup
alter table posts add column search_vector tsvector;

-- Comment likes table
create table comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  is_like boolean not null default true,
  created_at timestamptz default now(),
  unique(comment_id, user_id)
);

-- Enable RLS on comment_likes
alter table comment_likes enable row level security;

-- Comment likes policies
create policy "Comment likes are viewable by everyone"
  on comment_likes for select
  using (true);

create policy "Authenticated users can create comment likes"
  on comment_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own comment likes"
  on comment_likes for update
  using (auth.uid() = user_id);

create policy "Users can delete own comment likes"
  on comment_likes for delete
  using (auth.uid() = user_id);

-- Series table
create table series (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  cover_image text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on series
alter table series enable row level security;

-- Series policies
create policy "Published series are viewable by everyone"
  on series for select
  using (status = 'published' or auth.uid() = author_id);

create policy "Authors can create series"
  on series for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own series"
  on series for update
  using (auth.uid() = author_id);

create policy "Authors can delete own series"
  on series for delete
  using (auth.uid() = author_id);

-- Add series fields to posts
alter table posts add column series_id uuid references series(id) on delete set null;
alter table posts add column series_order integer;

create index posts_search_idx on posts using gin(search_vector);

-- Trigger function to populate search_vector
create or replace function posts_search_trigger() returns trigger
language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.content, '')), 'C');
  return new;
end;
$$;

-- Create trigger for search vector updates
create trigger tsvectorupdate before insert or update on posts
  for each row execute procedure posts_search_trigger();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at on posts
create trigger update_posts_updated_at before update on posts
  for each row execute procedure update_updated_at_column();

-- Function to increment post views
create or replace function increment_post_views(post_id uuid)
returns void as $$
begin
  update posts set views = views + 1 where id = post_id;
end;
$$ language plpgsql security definer;

-- Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true);

-- Storage policies for post-images bucket
create policy "Public images are accessible to everyone"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update own images"
  on storage.objects for update
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for performance
create index posts_author_id_idx on posts(author_id);
create index posts_status_idx on posts(status);
create index posts_published_at_idx on posts(published_at desc);
create index posts_slug_idx on posts(slug);
create index comments_post_id_idx on comments(post_id);
create index comments_is_approved_idx on comments(is_approved);
create index post_tags_post_id_idx on post_tags(post_id);
create index post_tags_tag_id_idx on post_tags(tag_id);
create index comment_likes_comment_id_idx on comment_likes(comment_id);
create index comment_likes_user_id_idx on comment_likes(user_id);
create index bookmarks_user_created_idx on bookmarks(user_id, created_at desc);
create index comment_likes_comment_user_idx on comment_likes(comment_id, user_id);
create index idx_series_slug on series(slug);
create index idx_series_author on series(author_id);
create index idx_series_status on series(status);
create index idx_posts_series_id on posts(series_id);
create index idx_posts_series_order on posts(series_id, series_order);

-- Series helper functions
create or replace function get_series_post_count(series_id_param uuid)
returns integer
language plpgsql
security definer
as $$
declare
  post_count integer;
begin
  select count(*)
  into post_count
  from posts
  where series_id = series_id_param and status = 'published';
  return coalesce(post_count, 0);
end;
$$;

create or replace function get_next_post_in_series(current_post_id uuid)
returns table (id uuid, title text, slug text, series_order integer)
language plpgsql
security definer
as $$
declare
  current_series_id uuid;
  current_order integer;
begin
  select posts.series_id, posts.series_order
  into current_series_id, current_order
  from posts
  where posts.id = current_post_id;

  if current_series_id is null then
    return;
  end if;

  return query
  select posts.id, posts.title, posts.slug, posts.series_order
  from posts
  where posts.series_id = current_series_id
    and posts.series_order > current_order
    and posts.status = 'published'
  order by posts.series_order asc
  limit 1;
end;
$$;

create or replace function get_previous_post_in_series(current_post_id uuid)
returns table (id uuid, title text, slug text, series_order integer)
language plpgsql
security definer
as $$
declare
  current_series_id uuid;
  current_order integer;
begin
  select posts.series_id, posts.series_order
  into current_series_id, current_order
  from posts
  where posts.id = current_post_id;

  if current_series_id is null then
    return;
  end if;

  return query
  select posts.id, posts.title, posts.slug, posts.series_order
  from posts
  where posts.series_id = current_series_id
    and posts.series_order < current_order
    and posts.status = 'published'
  order by posts.series_order desc
  limit 1;
end;
$$;

-- Function to return most popular tags by published post count
create or replace function get_popular_tags(limit_count integer default 10)
returns table (
  id uuid,
  name text,
  slug text,
  post_count integer
)
language sql
security definer
as $$
  select
    t.id,
    t.name,
    t.slug,
    count(pt.post_id) as post_count
  from tags t
  join post_tags pt on pt.tag_id = t.id
  join posts p on p.id = pt.post_id and p.status = 'published'
  group by t.id, t.name, t.slug
  order by post_count desc, t.name asc
  limit limit_count;
$$;
