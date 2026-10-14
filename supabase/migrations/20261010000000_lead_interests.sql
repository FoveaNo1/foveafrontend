-- "Hear about it first" on the landing page's Next section (app/api/interest/route.ts).
-- One row per (email, interest); the route upserts and ignores duplicates. Written only by the
-- service role: row-level security is on and no policy grants anyone else access.

create table if not exists public.lead_interests (
  email text not null,
  interest text not null check (interest in ('next')),
  country text,
  city text,
  created_at timestamptz not null default now(),
  primary key (email, interest)
);

alter table public.lead_interests enable row level security;
