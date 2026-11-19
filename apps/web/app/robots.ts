import type { MetadataRoute } from 'next'
import { isProduction, siteUrl } from '@/lib/site'

/** Accounts, the component showcase, the tester kit and booking steps are never for search engines. */
const privatePaths = ['me', 'org', 'trainer', 'admin', 'showcase', 'test', 'sign-in', 'join', 'p'].flatMap((a) => [`/ar/${a}`, `/en/${a}`])

/**
 * Until the go-live gate (FORSA_ENV=production) nothing is crawled. After it, the public pages are,
 * and the sitemap says which.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: [...privatePaths, '/api/', '/*/book'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
