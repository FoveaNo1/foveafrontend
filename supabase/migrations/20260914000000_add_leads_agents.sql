-- Get Early Access (landing/point-and-tell): persist the agents textarea.
-- Form POST /api/subscribe { email, agents? } → public.leads
--   email  → leads.email
--   agents → leads.agents  (free text; do not map onto role, tools, or ai_frequency)
--
-- This file is the repo copy of the statement. It does not apply itself to
-- production. Run it in the Supabase SQL editor for the project behind
-- NEXT_PUBLIC_SUPABASE_URL (or `supabase db push` if this project is linked).

alter table public.leads add column if not exists agents text;
