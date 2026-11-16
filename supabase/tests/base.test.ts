import type { PGlite } from '@electric-sql/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDatabase, makeHelpers } from './db'

const P1 = '00000000-0000-4000-8000-000000000001'
const P2 = '00000000-0000-4000-8000-000000000002'
const ADMIN = '00000000-0000-4000-8000-0000000000a1'

let db: PGlite
const { asUser, code, rows, users } = makeHelpers(() => db)

beforeAll(async () => {
  db = await createDatabase()
  await users([P1, P2, ADMIN], [ADMIN])
})
afterAll(async () => {
  await db.close()
})

describe('every table', () => {
  it('has row-level security enabled and forced', async () => {
    const tables = await rows<{ relname: string; relrowsecurity: boolean; relforcerowsecurity: boolean }>(`
      select c.relname, c.relrowsecurity, c.relforcerowsecurity
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'`)
    expect(tables.map((t) => t.relname).sort()).toEqual(['audit_log', 'profiles', 'settings'])
    for (const t of tables) {
      expect(t.relrowsecurity, t.relname).toBe(true)
      expect(t.relforcerowsecurity, t.relname).toBe(true)
    }
  })
  it('gives visitors no write privilege at all', async () => {
    const grants = await rows<{ table_name: string; privilege_type: string }>(`
      select table_name, privilege_type from information_schema.role_table_grants
      where grantee = 'anon' and table_schema = 'public' and privilege_type <> 'SELECT'`)
    expect(grants).toEqual([])
  })
})

describe('profiles', () => {
  it('are created at sign-up as participants, in the sign-up language', async () => {
    await db.query(`insert into auth.users (id, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000e1', '{"locale":"en","role":"admin"}')`)
    const [p] = await rows<{ role: string; locale: string }>(`select role, locale from public.profiles where id = '00000000-0000-4000-8000-0000000000e1'`)
    // A role asked for in the sign-up data is ignored: nobody becomes admin by signing up.
    expect(p).toEqual({ role: 'participant', locale: 'en' })
  })
  it('fall back to Arabic for an unknown sign-up language', async () => {
    await db.query(`insert into auth.users (id, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000e2', '{"locale":"fr"}')`)
    const [p] = await rows<{ locale: string }>(`select locale from public.profiles where id = '00000000-0000-4000-8000-0000000000e2'`)
    expect(p!.locale).toBe('ar')
  })
  it('are read only by their owner', async () => {
    const own = await asUser(P1, () => rows<{ id: string }>('select id from public.profiles'))
    expect(own.map((r) => r.id)).toEqual([P1])
  })
  it('are invisible to visitors', async () => {
    expect(await asUser(null, () => code('select id from public.profiles'))).toBe('42501')
  })
  it('can be edited by their owner, not by another user', async () => {
    expect(await asUser(P1, () => code(`update public.profiles set full_name = 'مريم' where id = $1`, [P1]))).toBe('ok')
    await asUser(P2, () => db.query(`update public.profiles set full_name = 'غريب' where id = $1`, [P1]))
    const [p] = await rows<{ full_name: string }>('select full_name from public.profiles where id = $1', [P1])
    expect(p!.full_name).toBe('مريم')
  })
  it('refuse a role change by the user (no privilege)', async () => {
    expect(await asUser(P1, () => code(`update public.profiles set role = 'admin' where id = $1`, [P1]))).toBe('42501')
  })
  it('refuse a role change even if a grant were added by mistake (trigger)', async () => {
    await db.exec('grant update (role) on public.profiles to authenticated')
    expect(await asUser(P1, () => code(`update public.profiles set role = 'admin' where id = $1`, [P1]))).toBe('42501')
    await db.exec('revoke update (role) on public.profiles from authenticated')
  })
  it('cannot be created or deleted by a user', async () => {
    expect(await asUser(P1, () => code(`insert into public.profiles (id) values ($1)`, [P2]))).toBe('42501')
    expect(await asUser(P1, () => code(`delete from public.profiles where id = $1`, [P1]))).toBe('42501')
  })
  it('refuse invalid values', async () => {
    expect(await asUser(P1, () => code(`update public.profiles set locale = 'fr' where id = $1`, [P1]))).toBe('23514')
    expect(await asUser(P1, () => code(`update public.profiles set phone = 'call me' where id = $1`, [P1]))).toBe('23514')
  })
  it('are all readable by an admin', async () => {
    const all = await asUser(ADMIN, () => rows('select id from public.profiles'))
    expect(all.length).toBe(5)
  })
  it('go when the account is deleted', async () => {
    await db.query(`delete from auth.users where id = '00000000-0000-4000-8000-0000000000e2'`)
    const left = await rows(`select id from public.profiles where id = '00000000-0000-4000-8000-0000000000e2'`)
    expect(left).toEqual([])
  })
})

describe('settings', () => {
  it('show visitors only the public keys', async () => {
    const keys = await asUser(null, () => rows<{ key: string }>('select key from public.settings order by key'))
    expect(keys.map((k) => k.key)).toEqual([
      'booking.refund_window_hours',
      'booking.reservation_hold_hours',
      'price.workshop_default_dirhams',
    ])
  })
  it('show an admin every key', async () => {
    const keys = await asUser(ADMIN, () => rows('select key from public.settings'))
    expect(keys.length).toBe(6)
  })
  it('cannot be written directly by anyone signed in', async () => {
    expect(await asUser(ADMIN, () => code(`update public.settings set value = '1' where key = 'booking.refund_window_hours'`))).toBe('42501')
    expect(await asUser(P1, () => code(`insert into public.settings (key, value) values ('x.y.z', '1')`))).toBe('42501')
  })
  it('are changed only by an admin, through the function, and logged', async () => {
    expect(await asUser(P1, () => code(`select public.set_setting('booking.refund_window_hours', '24')`))).toBe('42501')
    expect(await asUser(null, () => code(`select public.set_setting('booking.refund_window_hours', '24')`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`select public.set_setting('booking.refund_window_hours', '24')`))).toBe('ok')
    const [s] = await rows<{ value: number; updated_by: string }>(`select value, updated_by from public.settings where key = 'booking.refund_window_hours'`)
    expect(s).toEqual({ value: 24, updated_by: ADMIN })
    const log = await rows<{ actor_id: string; action: string; entity_id: string; details: unknown }>(
      `select actor_id, action, entity_id, details from public.audit_log where entity = 'settings'`)
    expect(log).toEqual([{ actor_id: ADMIN, action: 'setting.changed', entity_id: 'booking.refund_window_hours', details: { from: 48, to: 24 } }])
  })
  it('refuse an unknown key', async () => {
    expect(await asUser(ADMIN, () => code(`select public.set_setting('nothing.here', '1')`))).toBe('P0002')
  })
  it('never switch payments on, not even for an admin', async () => {
    expect(await asUser(ADMIN, () => code(`select public.set_setting('flag.payments_card', 'true')`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`select public.set_setting('flag.payments_bank_transfer', 'true')`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`select public.set_setting('flag.payments_card', 'false')`))).toBe('ok')
  })
})

describe('audit log', () => {
  it('is read only by admins', async () => {
    expect((await asUser(P1, () => rows('select id from public.audit_log'))).length).toBe(0)
    expect(await asUser(null, () => code('select id from public.audit_log'))).toBe('42501')
    expect((await asUser(ADMIN, () => rows('select id from public.audit_log'))).length).toBeGreaterThan(0)
  })
  it('cannot be written, changed or erased directly, not even by an admin', async () => {
    expect(await asUser(ADMIN, () => code(`insert into public.audit_log (action, entity) values ('fake.entry', 'x')`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`update public.audit_log set action = 'changed'`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`delete from public.audit_log`))).toBe('42501')
  })
  it('cannot be written through the private helper by a user', async () => {
    expect(await asUser(P1, () => code(`select private.audit('fake.entry', 'x', null)`))).toBe('42501')
    expect(await asUser(null, () => code(`select private.is_admin()`))).toBe('42501')
  })
})
