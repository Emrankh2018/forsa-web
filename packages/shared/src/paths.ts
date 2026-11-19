/**
 * Only an address on this site counts as a place to return to after sign-in: one leading slash,
 * no scheme, no protocol-relative "//", no backslashes, no control characters. Anything else is
 * ignored (no open redirect).
 */
export function safeReturnPath(next: unknown): string | null {
  if (typeof next !== 'string') return null
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\') || next.length > 200) return null
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(next)) return null
  return next
}

/** Areas that are never for search engines: accounts, the showcase, the tester kit, sign-in, joining, personal records. */
export const privateAreas = ['me', 'org', 'trainer', 'admin', 'showcase', 'test', 'sign-in', 'join', 'p'] as const

/**
 * robots.txt Disallow lines for the private areas in both languages. Robots rules match by prefix,
 * so each area is written as its exact address (`$`) and its sub-pages (`/`): `/ar/trainer` alone
 * would also block the public `/ar/trainers`, and `/ar/p` would block projects, partners and privacy.
 */
export function privateCrawlRules(locales: readonly string[] = ['ar', 'en']): string[] {
  return locales.flatMap((l) => privateAreas.flatMap((a) => [`/${l}/${a}$`, `/${l}/${a}/`]))
}

/** How a crawler reads one Disallow line (prefix match, `*` any characters, `$` end), for tests. */
export function robotsRuleMatches(rule: string, path: string): boolean {
  const body = rule.endsWith('$') ? rule.slice(0, -1) : rule
  const pattern = '^' + body.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + (rule.endsWith('$') ? '$' : '')
  return new RegExp(pattern).test(path)
}
