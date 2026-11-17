'use server'

import { partnerLeadFromForm, partnerLeadSchema, isLocale, type PartnerWay } from '@forsa/shared'
import { publicDb } from '@/lib/server/public-db'

export type LeadFieldError = 'orgName' | 'contactName' | 'email' | 'phone' | 'ways' | 'details'
export type LeadFormState = {
  status: 'idle' | 'error' | 'success'
  /** Message keys under partners.errors, per field. */
  errors: Partial<Record<LeadFieldError, LeadFieldError>>
  /** Whole-form problem, a key under partners.errors. */
  formError?: 'rateLimited' | 'unavailable' | 'failed'
  values: { orgName: string; contactName: string; email: string; phone: string; ways: PartnerWay[]; details: string }
  /** Changes on every submit, so the form remounts with the values above (React resets forms after actions). */
  attempt: number
}

export async function submitPartnerLead(prev: LeadFormState, form: FormData): Promise<LeadFormState> {
  const raw = partnerLeadFromForm(form)
  const base = { values: raw, attempt: prev.attempt + 1, errors: {} }

  // A hidden field people never see; automated senders fill it. Answer as if it worked, store nothing.
  const trap = form.get('website')
  if (typeof trap === 'string' && trap.length > 0) {
    return { ...base, status: 'success' }
  }

  const parsed = partnerLeadSchema.safeParse(raw)
  if (!parsed.success) {
    const errors: LeadFormState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.message as LeadFieldError
      errors[key] = key
    }
    return { ...base, status: 'error', errors }
  }

  const db = publicDb()
  if (!db) return { ...base, status: 'error', formError: 'unavailable' }

  const locale = form.get('locale')
  const v = parsed.data
  const { error } = await db.rpc('submit_partner_lead', {
    p_org_name: v.orgName,
    p_contact_name: v.contactName,
    p_email: v.email,
    p_phone: v.phone || null,
    p_ways: v.ways,
    p_details: v.details || null,
    p_locale: isLocale(locale) ? locale : 'ar',
  })
  if (error) {
    if (error.message?.includes('rate_limited')) return { ...base, status: 'error', formError: 'rateLimited' }
    return { ...base, status: 'error', formError: 'failed' }
  }
  return { ...base, status: 'success', values: { orgName: '', contactName: '', email: '', phone: '', ways: [], details: '' } }
}
