/**
 * The message groups that code running in the browser may read with useTranslations. Only these are
 * sent to the browser (embedded in every page); everything else stays on the server, which renders
 * it into the HTML already. Every group named in a useTranslations('…') call anywhere in apps/web
 * must be listed: `scripts/check-client-messages.mjs` (part of `npm run copy`) fails otherwise.
 */
export const clientNamespaces = [
  'account', 'adminAudit', 'adminGuides', 'adminLists', 'adminPeople', 'app', 'booking', 'common', 'cvcheck',
  'errorPage', 'forms', 'invitations', 'me', 'noticesPage', 'onboarding', 'org', 'orgReg', 'orgSettings',
  'orgTeam', 'partners', 'pitch', 'player', 'profile', 'project', 'settings', 'signInFlow', 'slots', 'testKit',
  'trainerApp', 'trainerArea', 'trainerProfile', 'trainerSessions', 'ui', 'workshopForm', 'workspace',
] as const

export function pickClientMessages<T extends Record<string, unknown>>(all: T): Partial<T> {
  return Object.fromEntries(clientNamespaces.filter((k) => k in all).map((k) => [k, all[k]])) as Partial<T>
}
