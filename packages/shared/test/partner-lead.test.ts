import { describe, expect, it } from 'vitest'
import { partnerLeadFromForm, partnerLeadSchema } from '../src'

function form(entries: Array<[string, string]>) {
  const f = new FormData()
  for (const [k, v] of entries) f.append(k, v)
  return f
}

describe('partner lead form', () => {
  it('accepts a complete form and cleans it', () => {
    const r = partnerLeadSchema.safeParse(partnerLeadFromForm(form([
      ['orgName', '  شركة تجريبية '], ['contactName', 'مريم'], ['email', ' Mariam@Example.COM '],
      ['phone', '+٩٧٤ ٥٥٥٠ ٠٠٠٠'], ['ways', 'post_project'], ['ways', 'sponsor'], ['details', ''],
    ])))
    expect(r.success).toBe(true)
    expect(r.data).toMatchObject({ orgName: 'شركة تجريبية', email: 'mariam@example.com', phone: '+97455500000', ways: ['post_project', 'sponsor'] })
  })
  it('names each wrong field', () => {
    const r = partnerLeadSchema.safeParse(partnerLeadFromForm(form([
      ['orgName', 'x'], ['contactName', ''], ['email', 'nope'], ['phone', '12'], ['ways', 'be_famous'],
    ])))
    expect(r.success).toBe(false)
    const keys = r.error!.issues.map((i) => i.message).sort()
    expect(keys).toEqual(['contactName', 'email', 'orgName', 'phone', 'ways'])
  })
  it('allows an empty phone', () => {
    const r = partnerLeadSchema.safeParse(partnerLeadFromForm(form([
      ['orgName', 'شركة'], ['contactName', 'سالم'], ['email', 'a@b.qa'], ['phone', ''], ['ways', 'give_workshop'],
    ])))
    expect(r.success).toBe(true)
  })
})
