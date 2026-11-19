import type { MetadataRoute } from 'next'
import { privateCrawlRules } from '@forsa/shared'
import { isProduction, siteUrl } from '@/lib/site'

/**
 * Until the go-live gate (FORSA_ENV=production) nothing is crawled. After it, the public pages are,
 * and the sitemap says which. Accounts, showcase, tester kit and booking steps never are (exact
 * rules from shared, tested so that /trainers, /projects, /partners and /privacy stay open).
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: [...privateCrawlRules(), '/api/', '/*/book'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
