import { z } from 'zod'
import { toWesternDigits } from '../locale'

/**
 * Validation for every form in the platform, shared by the browser (instant feedback) and, once
 * the back end exists, the server (the authority). Each error message is a key under
 * `forms.errors` in the interface messages, so the same rule speaks both languages.
 */

const text = (min: number, max: number, key = 'tooShort') =>
  z.string().trim().min(min, min <= 1 ? 'required' : key).max(max, 'tooLong')
const optionalText = (max: number) => z.string().trim().max(max, 'tooLong')
const email = z.string().trim().toLowerCase().max(254, 'email').email('email')
const phone = z
  .string()
  .trim()
  .transform((v) => toWesternDigits(v).replace(/[\s-]/g, ''))
  .refine((v) => v === '' || /^\+?[0-9]{7,15}$/.test(v), 'phone')
const url = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v), 'url')
const lines = (maxLines: number, maxEach: number) =>
  z
    .string()
    .transform((v) => v.split('\n').map((l) => l.trim()).filter(Boolean))
    .refine((l) => l.length >= 1, 'required')
    .refine((l) => l.length <= maxLines, 'tooMany')
    .refine((l) => l.every((x) => x.length <= maxEach), 'tooLong')
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date')

export const fieldKeys = ['marketing_media', 'applied_ai'] as const
export const participantStatuses = ['near_graduate', 'graduate', 'no_degree'] as const
export const orgCapabilities = ['project_partner', 'talent_partner'] as const

// Sign-in: email, then a six-digit code (Arabic digits accepted).
export const signInEmailSchema = z.object({ email })
export const signInCodeSchema = z.object({
  code: z.string().transform((v) => toWesternDigits(v).replace(/\s/g, '')).refine((v) => /^\d{6}$/.test(v), 'code'),
})

// Participant onboarding.
export const participantOnboardingSchema = z
  .object({
    fullName: text(2, 100, 'name'),
    city: optionalText(60),
    phone,
    status: z.enum(participantStatuses, { error: 'pickOne' }),
    university: optionalText(120),
    major: optionalText(120),
    graduationYear: z
      .string()
      .transform((v) => toWesternDigits(v).trim())
      .refine((v) => v === '' || (/^\d{4}$/.test(v) && +v >= 2000 && +v <= 2035), 'year'),
    fields: z.array(z.enum(fieldKeys)).min(1, 'pickOne'),
    bio: optionalText(600),
    adult: z.literal(true, { error: 'adult' }),
    consent: z.literal(true, { error: 'consent' }),
  })
  .refine((v) => v.status === 'no_degree' || v.university.length > 0, { message: 'required', path: ['university'] })

// Organisation registration (verified by an admin before the first project goes live).
export const orgRegistrationSchema = z.object({
  orgName: text(2, 120),
  sector: text(2, 80),
  website: url,
  registrationNumber: z
    .string()
    .transform((v) => toWesternDigits(v).trim())
    .refine((v) => /^[A-Za-z0-9-]{3,30}$/.test(v), 'registration'),
  capabilities: z.array(z.enum(orgCapabilities)).min(1, 'pickOne'),
  contactName: text(2, 100, 'name'),
  contactEmail: email,
  contactPhone: phone,
  consent: z.literal(true, { error: 'consent' }),
})

// Trainer application (approved by an admin).
export const trainerApplicationSchema = z.object({
  fullName: text(2, 100, 'name'),
  expertise: text(3, 160),
  bio: text(40, 1200, 'bioShort'),
  links: url,
  topics: lines(6, 120),
  remoteOk: z.boolean(),
  consent: z.literal(true, { error: 'consent' }),
})

// Post a project (four steps). Each step can be checked on its own.
export const projectBriefSchema = z.object({ title: text(6, 120), brief: text(60, 3000, 'briefShort'), field: z.enum(fieldKeys, { error: 'pickOne' }) })
export const projectWorkSchema = z.object({ deliverables: lines(8, 200), acceptance: lines(8, 200), steps: lines(10, 120) })
export const projectJoinSchema = z
  .object({
    mode: z.enum(['open', 'apply'], { error: 'pickOne' }),
    seats: z.coerce.number({ error: 'seats' }).int('seats').min(1, 'seats').max(50, 'seats'),
    applyBy: z.string(),
    due: isoDate,
  })
  .refine((v) => v.mode === 'open' || /^\d{4}-\d{2}-\d{2}$/.test(v.applyBy), { message: 'date', path: ['applyBy'] })
  .refine((v) => v.mode === 'open' || v.applyBy < v.due, { message: 'dates', path: ['applyBy'] })

// A company's review of one hand-in.
export const reviewSchema = z
  .object({
    decision: z.enum(['accepted', 'changes_requested', 'declined'], { error: 'pickOne' }),
    feedback: optionalText(3000),
    strengths: optionalText(600),
    rating: z.coerce.number().int().min(0).max(5),
  })
  .refine((v) => v.decision === 'accepted' || v.feedback.length >= 20, { message: 'feedback', path: ['feedback'] })

// Participant actions in the workspace.
export const handInSchema = z.object({ text: text(20, 4000, 'handInShort'), links: url })
export const questionSchema = z.object({ question: text(8, 600) })
export const updateSchema = z.object({ update: text(4, 1000) })

// Booking a 1-to-1 slot: one of the open slots must be chosen.
export const slotBookingSchema = z.object({ slot: z.string().min(1, 'pickSlot') })

// Settings and account deletion.
export const settingsSchema = z.object({
  locale: z.enum(['ar', 'en']),
  handle: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === '' || /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(v), 'handle'),
})
export const deleteAccountSchema = (word: string) =>
  z.object({ confirm: z.string().trim().refine((v) => v === word, 'deleteConfirm') })

// Participant profile (shown to companies and on the public page).
export const profileSchema = z.object({ headline: optionalText(120), bio: optionalText(600), skills: z.string().transform((v) => v.split('\n').map((l) => l.trim()).filter(Boolean)).refine((l) => l.length <= 12, 'tooMany').refine((l) => l.every((x) => x.length <= 40), 'tooLong'), links: url })

// Organisation: team invitations and settings.
export const teamRoles = ['owner', 'reviewer', 'member'] as const
export const teamInviteSchema = z.object({ email, role: z.enum(teamRoles, { error: 'pickOne' }) })
export const orgSettingsSchema = z.object({ orgName: text(2, 120), sector: text(2, 80), website: url, about: optionalText(800) })

// Trainer: session types and profile.
export const sessionTypeSchema = z.object({
  name: text(3, 80),
  minutes: z.string().transform((v) => Number(toWesternDigits(v).trim())).refine((n) => Number.isInteger(n) && n >= 15 && n <= 120, 'minutes'),
})
export const trainerProfileSchema = z.object({ expertise: text(3, 160), bio: text(40, 1200, 'bioShort'), links: url })

// Trainer: a workshop sent for publishing. In person needs a place; online needs nothing more
// (the link is added by the team after payment is confirmed).
export const workshopSchema = z
  .object({
    title: text(6, 120),
    summary: text(20, 400),
    outcomes: lines(6, 160),
    date: isoDate,
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time'),
    minutes: z.string().transform((v) => Number(toWesternDigits(v).trim())).refine((n) => Number.isInteger(n) && n >= 30 && n <= 240, 'workshopMinutes'),
    mode: z.enum(['online', 'in_person'], { error: 'pickOne' }),
    place: optionalText(160),
    seats: z.string().transform((v) => Number(toWesternDigits(v).trim())).refine((n) => Number.isInteger(n) && n >= 1 && n <= 50, 'seats'),
  })
  .refine((v) => v.mode === 'online' || v.place.length >= 3, { message: 'required', path: ['place'] })

// Admin: adding a skill (both languages) to a field.
export const skillSchema = z.object({ field: z.enum(fieldKeys, { error: 'pickOne' }), skillAr: text(2, 40), skillEn: text(2, 40) })

// Admin: editing a guide's card.
export const guideCardSchema = z.object({ titleAr: text(4, 120), titleEn: text(4, 120), summaryAr: text(20, 300), summaryEn: text(20, 300) })

/** Turns a failed parse into { field: messageKey }, keeping the first problem per field. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!(key in out)) out[key] = issue.message
  }
  return out
}
