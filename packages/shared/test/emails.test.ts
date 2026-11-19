import { describe, expect, it } from 'vitest'
import { emailTemplates, renderEmail, type EmailKind } from '../src/emails/templates'
// @ts-expect-error the copy checker is plain JavaScript without type declarations
import { checkText } from '../../../scripts/check-copy.mjs'

const sample: Record<string, string> = { code: '482916', workshop: 'CV', amount: '250', hours: '48', date: 'Sunday', project: 'Launch', participant: 'Reem', company: 'Al Ramla Café', organisation: 'Madar', name: 'Hala', count: '3' }

describe('email templates', () => {
  it('fill every placeholder in both languages, with HTML and plain text', () => {
    for (const kind of Object.keys(emailTemplates) as EmailKind[]) {
      for (const locale of ['ar', 'en'] as const) {
        const e = renderEmail(kind, locale, sample, 'https://forsa.example')
        expect(e.subject).not.toMatch(/\{\w+\}/)
        expect(e.html).not.toMatch(/\{\w+\}/)
        expect(e.text).not.toMatch(/\{\w+\}/)
        expect(e.html).toContain(`dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`)
      }
    }
  })
  it('lists exactly the placeholders each template uses', () => {
    for (const [kind, t] of Object.entries(emailTemplates)) {
      const used = new Set(JSON.stringify([t.subject, t.title, t.body, 'note' in t ? t.note : '']).match(/\{(\w+)\}/g)?.map((m) => m.slice(1, -1)))
      expect([...used].sort(), kind).toEqual([...t.placeholders].sort())
    }
  })
  it('escapes values in HTML but not in plain text, and links to the right language', () => {
    const e = renderEmail('companyInvitation', 'en', { company: 'A <b>&</b> Co' }, 'https://forsa.example')
    expect(e.html).toContain('A &lt;b&gt;&amp;&lt;/b&gt; Co')
    expect(e.text).toContain('A <b>&</b> Co')
    expect(e.html).toContain('href="https://forsa.example/en/me/invitations"')
  })
  it('refuses to send with a missing value', () => {
    expect(() => renderEmail('signInCode', 'ar', {}, 'https://forsa.example')).toThrow(/code/)
  })
  it('passes the copy rules (no job promises, Arabic numerals in Arabic)', () => {
    for (const t of Object.values(emailTemplates)) {
      for (const part of [t.subject, t.title, t.body]) {
        expect(checkText(part.ar, 'ar')).toEqual([])
        expect(checkText(part.en, 'en')).toEqual([])
      }
    }
  })
})
