import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** Until the go-live gate (phase 11) every build is a preview: never indexed by search engines. */
const isProduction = process.env.FORSA_ENV === 'production'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content-Security-Policy in the form Next.js documents for statically built pages (a nonce would
 * make every page render per request). Scripts, styles, fonts and requests stay on the site itself;
 * 'unsafe-inline' is needed for Next's own inline page data and the arrival gate. No plug-ins, no
 * framing by other sites, forms post only here. When the database moves to the VPS and the browser
 * talks to it directly, add its address to connect-src.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  // Vercel adds this itself; the VPS needs it from the site. Browsers ignore it on plain http (local).
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ...(isProduction ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
]

/** Never indexed, even after go-live: accounts, the component showcase and the tester kit. */
const privateAreas = '/:locale(ar|en)/:area(me|org|trainer|admin|showcase|test|sign-in|join)'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // VPS: `next build` also writes .next/standalone, a folder that runs with `node apps/web/server.js`
  // and no npm install (docs/VPS-DEPLOY.md). Tracing starts at the monorepo root so packages/shared
  // is included. Vercel ignores this and deploys as before.
  output: 'standalone',
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
  transpilePackages: ['@forsa/shared'],
  async headers() {
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
    return [
      { source: '/:path*', headers: securityHeaders },
      ...(isProduction ? [{ source: privateAreas, headers: noindex }, { source: `${privateAreas}/:rest*`, headers: noindex }] : []),
    ]
  },
}

export default withNextIntl(nextConfig)
