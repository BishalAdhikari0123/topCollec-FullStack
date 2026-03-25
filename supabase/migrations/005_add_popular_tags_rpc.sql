-- Add missing RPC used by getPopularTags server action
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
    count(pt.post_id)::integer as post_count
  from tags t
  join post_tags pt on pt.tag_id = t.id
  join posts p on p.id = pt.post_id and p.status = 'published'
  group by t.id, t.name, t.slug
  order by post_count desc, t.name asc
  limit limit_count;
$$;
