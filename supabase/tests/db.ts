import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'

const here = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.join(here, '..', 'migrations')

export function migrationFiles(): string[] {
  return readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
}

/**
 * An embedded Postgres (PGlite) prepared like a Supabase database, then every migration applied in
 * order. Recreated first: the Supabase roles with Supabase's default grants on new public tables,
 * and a minimal stand-in for Supabase Auth (auth.users and auth.uid(), which reads the JWT "sub"
 * claim from the request settings exactly as Supabase's own function does).
 */
export async function createDatabase(): Promise<PGlite> {
  const db = new PGlite()
  await db.exec(`
    create role anon nologin noinherit;
    create role authenticated nologin noinherit;
    create role service_role nologin noinherit bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

    create schema auth;
    grant usage on schema auth to anon, authenticated, service_role;
    create table auth.users (
      id uuid primary key default gen_random_uuid(),
      email text unique,
      raw_user_meta_data jsonb not null default '{}'::jsonb
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid
    $$;
  `)
  for (const file of migrationFiles()) await db.exec(readFileSync(path.join(migrationsDir, file), 'utf8'))
  return db
}

/** Helpers that run SQL as a given user (or as a visitor when the id is null). */
export function makeHelpers(get: () => PGlite) {
  const db = () => get()
  const claims = (id: string | null) => (id ? JSON.stringify({ sub: id, role: 'authenticated' }) : '')

  async function asUser<T>(id: string | null, fn: () => Promise<T>): Promise<T> {
    await db().query(`select set_config('request.jwt.claims', $1, false)`, [claims(id)])
    await db().exec(id ? 'set role authenticated' : 'set role anon')
    try {
      return await fn()
    } finally {
      await db().exec('reset role')
      await db().query(`select set_config('request.jwt.claims', '', false)`)
    }
  }

  /** Runs a statement and returns 'ok' or the Postgres error code (42501 = refused). */
  async function code(sql: string, params: unknown[] = []): Promise<string> {
    try {
      await db().query(sql, params)
      return 'ok'
    } catch (err) {
      return (err as { code?: string }).code ?? 'unknown'
    }
  }

  async function rows<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    return (await db().query<T>(sql, params)).rows
  }

  /** Creates auth users (which creates their profiles); the given ids become admins by hand. */
  async function users(ids: string[], admins: string[] = []) {
    for (const id of ids) await db().query('insert into auth.users (id) values ($1)', [id])
    for (const id of admins) await db().query(`update public.profiles set role = 'admin' where id = $1`, [id])
  }

  return { asUser, code, rows, users }
}
