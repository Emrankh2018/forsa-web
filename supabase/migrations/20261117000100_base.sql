-- Phase 0 base migration (plan V4 sections 5, 6 and 11).
--
-- Pattern for every table in this project:
-- - row-level security enabled AND forced, even for the table owner;
-- - Supabase's default grants taken back, then only the exact column privileges the rules allow;
-- - no direct writes for state changes: each one goes through a single security-definer function
--   that checks the role and the state and writes the audit entry in the same transaction;
-- - helper functions live in the "private" schema, which the Data API does not expose.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

-- updated_at on every table.
create or replace function private.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- profiles: one per auth user.
-- Roles: participant, org_member (organisation member), trainer, admin. One role per account in v1.
-- Admins are never created by sign-up: the owner sets the role by hand (service role / SQL editor).
-- ---------------------------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  role text not null default 'participant'
    check (role in ('participant', 'org_member', 'trainer', 'admin')),
  full_name text check (char_length(btrim(full_name)) between 2 and 100),
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  phone text check (phone ~ '^\+?[0-9]{7,15}$'),
  city text check (char_length(btrim(city)) between 2 and 60),
  avatar_path text check (char_length(avatar_path) <= 300),
  onboarded_at timestamptz
);

create index profiles_role_idx on public.profiles (role);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

-- A new auth user gets a profile. The language the person signed up in is kept if it is valid;
-- the role always starts as participant (phase 3 adds the guarded path to organisation or trainer).
create or replace function private.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_locale text := coalesce(new.raw_user_meta_data ->> 'locale', 'ar');
begin
  insert into public.profiles (id, locale)
  values (new.id, case when v_locale in ('ar', 'en') then v_locale else 'ar' end);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- Second guard on the role, beside the missing column privilege: a signed-in user or a visitor can
-- never change a role, even if a grant were added by mistake.
create or replace function private.protect_role() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and current_user in ('anon', 'authenticated') then
    raise exception 'role is set by the server' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role before update on public.profiles
  for each row execute function private.protect_role();

-- Used inside policies. Security definer so it does not recurse into the profiles policies.
create or replace function private.is_admin() returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

create or replace function private.user_role() returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

-- ---------------------------------------------------------------------------------------------
-- audit_log: every admin action and every state change. Written only by private.audit().
-- ---------------------------------------------------------------------------------------------
create table public.audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) between 3 and 80),
  entity text not null check (char_length(entity) between 2 and 60),
  entity_id text check (char_length(entity_id) <= 100),
  details jsonb not null default '{}'::jsonb
);

create index audit_log_entity_idx on public.audit_log (entity, entity_id);
create index audit_log_created_at_idx on public.audit_log (created_at desc);
create index audit_log_actor_idx on public.audit_log (actor_id);

create or replace function private.audit(p_action text, p_entity text, p_entity_id text, p_details jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.audit_log (actor_id, action, entity, entity_id, details)
  values ((select auth.uid()), p_action, p_entity, p_entity_id, coalesce(p_details, '{}'::jsonb));
$$;

-- ---------------------------------------------------------------------------------------------
-- settings: prices, windows and feature flags. Admins read all and change them (set_setting);
-- visitors read only the keys marked public.
-- ---------------------------------------------------------------------------------------------
create table public.settings (
  key text primary key check (key ~ '^[a-z][a-z0-9_.]{2,62}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  value jsonb not null,
  is_public boolean not null default false,
  description text check (char_length(description) <= 300),
  updated_by uuid references auth.users (id) on delete set null
);

create index settings_updated_by_idx on public.settings (updated_by);

create trigger settings_updated_at before update on public.settings
  for each row execute function private.set_updated_at();

insert into public.settings (key, value, is_public, description) values
  ('price.workshop_default_dirhams', '25000', true, 'Default workshop price in dirhams (250 QAR)'),
  ('booking.reservation_hold_hours', '48', true, 'Hours an unconfirmed reservation holds a seat'),
  ('booking.refund_window_hours', '48', true, 'Full refund up to this many hours before a workshop'),
  ('flag.payments_bank_transfer', 'false', false, 'Bank transfer payments. Stays off until the owner opens the payments gate'),
  ('flag.payments_card', 'false', false, 'Card payments. Stays off until the owner opens the payments gate'),
  ('flag.email_sending', 'false', false, 'Real email sending. Off until a sender on the Forsa domain is connected');

-- Change a setting: admins only, logged. Payment flags cannot be switched on from here; that is the
-- payments gate (plan section 9), opened by a later migration only.
create or replace function public.set_setting(p_key text, p_value jsonb) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb;
begin
  if not private.is_admin() then
    raise exception 'only an admin can change settings' using errcode = '42501';
  end if;
  if p_key like 'flag.payments\_%' and p_value is distinct from 'false'::jsonb then
    raise exception 'payments stay off until the payments gate is opened' using errcode = '42501';
  end if;
  select value into v_old from public.settings where key = p_key for update;
  if not found then
    raise exception 'unknown setting' using errcode = 'P0002';
  end if;
  update public.settings set value = p_value, updated_by = (select auth.uid()) where key = p_key;
  perform private.audit('setting.changed', 'settings', p_key, jsonb_build_object('from', v_old, 'to', p_value));
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- Row-level security and privileges.
-- ---------------------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.audit_log enable row level security;
alter table public.audit_log force row level security;
alter table public.settings enable row level security;
alter table public.settings force row level security;

revoke all on table public.profiles, public.audit_log, public.settings from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, locale, phone, city, avatar_path) on table public.profiles to authenticated;
grant select on table public.audit_log to authenticated;
grant select on table public.settings to anon, authenticated;

create policy "own profile or admin can read" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "own profile can be edited" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "admins read the audit log" on public.audit_log
  for select to authenticated
  using ((select private.is_admin()));

create policy "public settings are readable by anyone" on public.settings
  for select to anon, authenticated
  using (is_public);

create policy "admins read every setting" on public.settings
  for select to authenticated
  using ((select private.is_admin()));

-- Functions: nobody calls the private ones directly except where a policy needs them.
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.user_role() to authenticated;
revoke execute on function public.set_setting(text, jsonb) from public, anon;
grant execute on function public.set_setting(text, jsonb) to authenticated;
