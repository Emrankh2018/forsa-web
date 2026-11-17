-- Phase 2: the partner interest form (plan V4 sections 2, 5 and 6).
--
-- Anyone may send the form; nobody may read it except admins. The only way in is
-- public.submit_partner_lead(), which validates every field, limits how often one email can send,
-- and writes the audit entry. Admins move a lead through new -> contacted -> converted | closed
-- with public.set_partner_lead_state().

create table public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  org_name text not null check (char_length(btrim(org_name)) between 2 and 120),
  contact_name text not null check (char_length(btrim(contact_name)) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone ~ '^\+?[0-9]{7,15}$'),
  ways text[] not null check (
    cardinality(ways) between 1 and 4
    and ways <@ array['post_project', 'give_workshop', 'train_batch', 'sponsor']::text[]
  ),
  details text check (char_length(details) <= 2000),
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  state text not null default 'new' check (state in ('new', 'contacted', 'converted', 'closed')),
  admin_note text check (char_length(admin_note) <= 1000),
  handled_by uuid references auth.users (id) on delete set null
);

create index partner_leads_state_created_idx on public.partner_leads (state, created_at desc);
create index partner_leads_email_created_idx on public.partner_leads (lower(email), created_at desc);
create index partner_leads_handled_by_idx on public.partner_leads (handled_by);

create trigger partner_leads_updated_at before update on public.partner_leads
  for each row execute function private.set_updated_at();

alter table public.partner_leads enable row level security;
alter table public.partner_leads force row level security;
revoke all on table public.partner_leads from anon, authenticated;
grant select on table public.partner_leads to authenticated;

create policy "admins read partner leads" on public.partner_leads
  for select to authenticated
  using ((select private.is_admin()));

-- Send the form. Returns the new lead's id. Errors: 22023 invalid input, P0001 'rate_limited'.
create or replace function public.submit_partner_lead(
  p_org_name text,
  p_contact_name text,
  p_email text,
  p_phone text,
  p_ways text[],
  p_details text,
  p_locale text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_ways text[] := array(select distinct unnest(coalesce(p_ways, '{}'::text[])) order by 1);
  v_recent int;
begin
  if char_length(btrim(coalesce(p_org_name, ''))) not between 2 and 120
     or char_length(btrim(coalesce(p_contact_name, ''))) not between 2 and 100
     or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     or cardinality(v_ways) = 0 then
    raise exception 'invalid input' using errcode = '22023';
  end if;

  -- At most three forms from one email address in a day.
  select count(*) into v_recent
  from public.partner_leads
  where lower(email) = v_email and created_at > now() - interval '1 day';
  if v_recent >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.partner_leads (org_name, contact_name, email, phone, ways, details, locale)
  values (
    btrim(p_org_name),
    btrim(p_contact_name),
    v_email,
    nullif(regexp_replace(coalesce(p_phone, ''), '[\s-]', '', 'g'), ''),
    v_ways,
    nullif(btrim(coalesce(p_details, '')), ''),
    case when p_locale in ('ar', 'en') then p_locale else 'ar' end
  )
  returning id into v_id;

  perform private.audit('lead.submitted', 'partner_leads', v_id::text, jsonb_build_object('ways', v_ways));
  return v_id;
end;
$$;

-- Move a lead along. Admins only, logged; a closed or converted lead does not reopen.
create or replace function public.set_partner_lead_state(p_id uuid, p_state text, p_note text default null) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old text;
begin
  if not private.is_admin() then
    raise exception 'only an admin can handle leads' using errcode = '42501';
  end if;
  select state into v_old from public.partner_leads where id = p_id for update;
  if not found then
    raise exception 'unknown lead' using errcode = 'P0002';
  end if;
  if not (
    (v_old = 'new' and p_state in ('contacted', 'converted', 'closed'))
    or (v_old = 'contacted' and p_state in ('converted', 'closed'))
  ) then
    raise exception 'a lead cannot move from % to %', v_old, p_state using errcode = '22023';
  end if;
  update public.partner_leads
  set state = p_state, admin_note = coalesce(p_note, admin_note), handled_by = (select auth.uid())
  where id = p_id;
  perform private.audit('lead.state_changed', 'partner_leads', p_id::text, jsonb_build_object('from', v_old, 'to', p_state));
end;
$$;

revoke execute on function public.submit_partner_lead(text, text, text, text, text[], text, text) from public;
grant execute on function public.submit_partner_lead(text, text, text, text, text[], text, text) to anon, authenticated;
revoke execute on function public.set_partner_lead_state(uuid, text, text) from public, anon;
grant execute on function public.set_partner_lead_state(uuid, text, text) to authenticated;
