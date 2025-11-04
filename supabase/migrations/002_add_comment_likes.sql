-- Add comment likes table for like/dislike functionality
create table comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  is_like boolean not null, -- true for like, false for dislike
  created_at timestamptz default now(),
  unique(comment_id, user_id)
);

-- Enable RLS on comment_likes
alter table comment_likes enable row level security;

-- Comment likes policies
create policy "Comment likes are viewable by everyone"
  on comment_likes for select
  using (true);

create policy "Authenticated users can like comments"
  on comment_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own likes"
  on comment_likes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on comment_likes for delete
  using (auth.uid() = user_id);

-- Add indexes for performance
create index idx_comment_likes_comment_id on comment_likes(comment_id);
create index idx_comment_likes_user_id on comment_likes(user_id);
create index idx_comments_post_id on comments(post_id);
create index idx_comments_parent_id on comments(parent_id);
