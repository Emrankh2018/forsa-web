/**
 * The one place that knows where the site lives and whether it is the real launch.
 * Both are read when the site is built (pages are built ahead), so set them before `npm run build`.
 * - SITE_URL: the public address, e.g. https://forsa.qa (no trailing slash needed).
 * - FORSA_ENV=production: only at the go-live gate; until then every page asks not to be indexed.
 */
export const siteUrl = (process.env.SITE_URL ?? 'https://forsa-demo.vercel.app').replace(/\/+$/, '')

export const isProduction = process.env.FORSA_ENV === 'production'

/** Shown on the contact page only when the owner sets it; no address is invented. */
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null

export const instagramUrl = 'https://www.instagram.com/forsa.qa2026/'
