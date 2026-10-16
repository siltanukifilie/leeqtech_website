-- Applied to LeeqTech (gbzjapigsmkzofjsibib) through the
-- create_leeqtech_enquiries migration. Reference schema; do not reapply.
create table public.leeqtech_enquiries (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null check (char_length(name) between 2 and 120),
 email text not null check (char_length(email) between 3 and 254),
 company text not null default '' check (char_length(company) <= 160),
 service text not null check (service in ('Consulting','Training','AI technology','Data engineering','IT solutions','Automation','Not sure yet')),
 message text not null check (char_length(message) between 20 and 4000),
 consent boolean not null check (consent = true)
);
alter table public.leeqtech_enquiries enable row level security;
revoke all on public.leeqtech_enquiries from anon, authenticated;
grant insert on public.leeqtech_enquiries to service_role;
-- No browser SELECT/INSERT policies: the verified server endpoint handles writes.
