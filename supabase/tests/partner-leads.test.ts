import type { PGlite } from '@electric-sql/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDatabase, makeHelpers } from './db'

const P1 = '00000000-0000-4000-8000-000000000001'
const ADMIN = '00000000-0000-4000-8000-0000000000a1'

let db: PGlite
const { asUser, code, rows, users } = makeHelpers(() => db)

const submit = (email: string, ways = "array['post_project']", org = 'شركة تجريبية') =>
  `select public.submit_partner_lead('${org}', 'مريم', '${email}', '+974 5550 0000', ${ways}, 'نريد طرح مشروع تسويق.', 'ar') as id`

beforeAll(async () => {
  db = await createDatabase()
  await users([P1, ADMIN], [ADMIN])
})
afterAll(async () => {
  await db.close()
})

describe('partner leads', () => {
  it('has row-level security enabled and forced', async () => {
    const [t] = await rows<{ relrowsecurity: boolean; relforcerowsecurity: boolean }>(
      `select relrowsecurity, relforcerowsecurity from pg_class where relname = 'partner_leads'`)
    expect(t).toEqual({ relrowsecurity: true, relforcerowsecurity: true })
  })

  it('can be sent by a visitor through the function, and is cleaned up', async () => {
    const [r] = await asUser(null, () => rows<{ id: string }>(submit(' Mariam@Example.com ')))
    expect(r!.id).toMatch(/^[0-9a-f-]{36}$/)
    const [lead] = await rows<{ email: string; phone: string; ways: string[]; state: string }>(
      'select email, phone, ways, state from public.partner_leads where id = $1', [r!.id])
    expect(lead).toEqual({ email: 'mariam@example.com', phone: '+97455500000', ways: ['post_project'], state: 'new' })
    const audit = await rows<{ action: string; actor_id: string | null }>(`select action, actor_id from public.audit_log where entity = 'partner_leads'`)
    expect(audit).toEqual([{ action: 'lead.submitted', actor_id: null }])
  })

  it('can be sent by a signed-in user too', async () => {
    expect(await asUser(P1, () => code(submit('p1@example.com', "array['give_workshop','sponsor']")))).toBe('ok')
  })

  it('is invisible to visitors and ordinary users', async () => {
    expect(await asUser(null, () => code('select id from public.partner_leads'))).toBe('42501')
    expect((await asUser(P1, () => rows('select id from public.partner_leads'))).length).toBe(0)
  })

  it('cannot be written directly by anyone', async () => {
    expect(await asUser(null, () => code(`insert into public.partner_leads (org_name, contact_name, email, ways) values ('xx', 'yy', 'a@b.co', array['sponsor'])`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`update public.partner_leads set state = 'closed'`))).toBe('42501')
    expect(await asUser(ADMIN, () => code(`delete from public.partner_leads`))).toBe('42501')
  })

  it('refuses invalid input', async () => {
    expect(await asUser(null, () => code(submit('not-an-email')))).toBe('22023')
    expect(await asUser(null, () => code(submit('ok@example.com', "array[]::text[]")))).toBe('22023')
    expect(await asUser(null, () => code(submit('ok@example.com', "array['be_famous']")))).toBe('23514')
    expect(await asUser(null, () => code(submit('ok@example.com', "array['sponsor']", 'x')))).toBe('22023')
  })

  it('limits one email to three forms a day', async () => {
    for (let i = 0; i < 3; i++) expect(await asUser(null, () => code(submit('busy@example.com')))).toBe('ok')
    expect(await asUser(null, () => code(submit('BUSY@example.com')))).toBe('P0001')
  })

  it('is read in full by an admin', async () => {
    const all = await asUser(ADMIN, () => rows('select id from public.partner_leads'))
    expect(all.length).toBe(5)
  })

  it('moves state only by an admin, only forward, and logged', async () => {
    const [lead] = await rows<{ id: string }>(`select id from public.partner_leads where email = 'p1@example.com'`)
    expect(await asUser(P1, () => code('select public.set_partner_lead_state($1, $2)', [lead!.id, 'contacted']))).toBe('42501')
    expect(await asUser(null, () => code('select public.set_partner_lead_state($1, $2)', [lead!.id, 'contacted']))).toBe('42501')
    expect(await asUser(ADMIN, () => code('select public.set_partner_lead_state($1, $2, $3)', [lead!.id, 'contacted', 'Called on Sunday']))).toBe('ok')
    expect(await asUser(ADMIN, () => code('select public.set_partner_lead_state($1, $2)', [lead!.id, 'new']))).toBe('22023')
    expect(await asUser(ADMIN, () => code('select public.set_partner_lead_state($1, $2)', [lead!.id, 'converted']))).toBe('ok')
    expect(await asUser(ADMIN, () => code('select public.set_partner_lead_state($1, $2)', [lead!.id, 'closed']))).toBe('22023')
    const [after] = await rows<{ state: string; handled_by: string; admin_note: string }>('select state, handled_by, admin_note from public.partner_leads where id = $1', [lead!.id])
    expect(after).toEqual({ state: 'converted', handled_by: ADMIN, admin_note: 'Called on Sunday' })
    const log = await rows(`select 1 from public.audit_log where action = 'lead.state_changed' and actor_id = $1`, [ADMIN])
    expect(log.length).toBe(2)
  })
})
