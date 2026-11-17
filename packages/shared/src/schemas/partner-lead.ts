import { z } from 'zod'
import { toWesternDigits } from '../locale'

/** Ways an organisation can work with Forsa (plan V4 section 2). Same list as the database check. */
export const partnerWays = ['post_project', 'give_workshop', 'train_batch', 'sponsor'] as const
export type PartnerWay = (typeof partnerWays)[number]

/**
 * The partner interest form. Mirrors the limits of public.submit_partner_lead(); the database
 * checks again. Error messages are message keys under `partners.errors`.
 */
export const partnerLeadSchema = z.object({
  orgName: z.string().trim().min(2, 'orgName').max(120, 'orgName'),
  contactName: z.string().trim().min(2, 'contactName').max(100, 'contactName'),
  email: z.string().trim().toLowerCase().max(254, 'email').email('email'),
  phone: z
    .string()
    .trim()
    .transform((v) => toWesternDigits(v).replace(/[\s-]/g, ''))
    .refine((v) => v === '' || /^\+?[0-9]{7,15}$/.test(v), 'phone'),
  ways: z.array(z.enum(partnerWays)).min(1, 'ways').max(4, 'ways'),
  details: z.string().trim().max(2000, 'details'),
})

export type PartnerLeadInput = z.infer<typeof partnerLeadSchema>

/** Reads the form fields; unknown ways are dropped so they fail the "pick one" rule cleanly. */
export function partnerLeadFromForm(form: FormData) {
  const str = (k: string) => (typeof form.get(k) === 'string' ? (form.get(k) as string) : '')
  return {
    orgName: str('orgName'),
    contactName: str('contactName'),
    email: str('email'),
    phone: str('phone'),
    ways: form.getAll('ways').filter((w): w is PartnerWay => typeof w === 'string' && (partnerWays as readonly string[]).includes(w)),
    details: str('details'),
  }
}
