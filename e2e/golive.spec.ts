import { expect, test } from '@playwright/test'
import { messages } from '../packages/shared/src/messages'

/**
 * Roadmap 2 (production/ROADMAP-VPS-READY.md) steps 1 to 4: what the site needs to run on its own
 * server and go live. Run against any build: local, standalone (E2E_STANDALONE=1) or live.
 * These are request checks, so they run once (desktop), not at every width.
 */
test.skip(({ viewport }) => (viewport?.width ?? 0) < 1000, 'request checks run once, on desktop')

test('health address answers ok and is never cached', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  expect(await res.json()).toEqual({ status: 'ok' })
  expect(res.headers()['cache-control']).toContain('no-store')
})

test('security headers on pages', async ({ request }) => {
  for (const path of ['/ar', '/en/projects', '/ar/me', '/en/showcase/emails']) {
    const h = (await request.get(path)).headers()
    const csp = h['content-security-policy'] ?? ''
    expect(csp, path).toContain("default-src 'self'")
    expect(csp, path).toContain("frame-ancestors 'none'")
    expect(csp, path).toContain("object-src 'none'")
    expect(csp, path).toContain("form-action 'self'")
    expect(h['strict-transport-security'], path).toContain('max-age=')
    expect(h['cross-origin-opener-policy'], path).toBe('same-origin')
    expect(h['x-content-type-options'], path).toBe('nosniff')
    expect(h['x-frame-options'], path).toBe('DENY')
  }
})

test('robots.txt blocks everything before go-live and names no private area as allowed', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toMatch(/User-Agent: \*/i)
  // This build is not the go-live build (FORSA_ENV unset): nothing may be crawled.
  expect(body).toMatch(/Disallow: \/\s*$/m)
})

test('sitemap lists the public pages in both languages with their twins', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  const xml = await res.text()
  for (const path of ['/ar', '/en', '/ar/projects', '/en/contact', '/ar/workshops/cv-thirty-seconds', '/en/guides/interview']) {
    expect(xml, path).toContain(`${path}</loc>`)
  }
  expect(xml).toContain('hreflang="en"')
  for (const area of ['/me', '/org', '/admin', '/trainer', '/showcase', '/test']) expect(xml).not.toContain(`/ar${area}<`)
})

test('icons and the web app manifest are served', async ({ request }) => {
  for (const [path, type] of [['/favicon.ico', 'image/'], ['/apple-icon.png', 'image/png'], ['/icon-192.png', 'image/png'], ['/icon-512.png', 'image/png'], ['/icon.svg', 'image/svg+xml']] as const) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    expect(res.headers()['content-type'], path).toContain(type)
  }
  const manifest = await request.get('/manifest.webmanifest')
  expect(manifest.status()).toBe(200)
  const m = await manifest.json()
  expect(m.start_url).toBe('/ar')
  expect(m.icons.length).toBeGreaterThanOrEqual(3)
})

test('every public page names itself and its other-language twin', async ({ page }) => {
  for (const path of ['', '/projects', '/projects/cafe-launch-campaign', '/workshops/cv-thirty-seconds', '/courses/content-basics', '/guides/cv', '/about', '/contact', '/faq']) {
    for (const locale of ['ar', 'en'] as const) {
      await page.goto(`/${locale}${path}`)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical, `${locale}${path}`).toMatch(new RegExp(`/${locale}${path.replace(/[?]/g, '\\?')}$`))
      for (const other of ['ar', 'en']) {
        const alt = await page.locator(`link[rel="alternate"][hreflang="${other}"]`).getAttribute('href')
        expect(alt, `${locale}${path} → ${other}`).toMatch(new RegExp(`/${other}${path}$`))
      }
      expect(await page.locator('meta[name="description"]').count(), `${locale}${path}`).toBe(1)
    }
  }
})

test('home page describes the organisation for search engines', async ({ page }) => {
  await page.goto('/en')
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')
  expect(data['@type']).toBe('Organization')
  expect(data.name).toBe(messages.en.meta.title)
  expect(data.sameAs[0]).toContain('instagram.com')
})

test('contact: Instagram opens safely in a new tab; the page links to the form and the questions', async ({ page }) => {
  for (const locale of ['ar', 'en'] as const) {
    const t = messages[locale].contact
    await page.goto(`/${locale}/contact`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.title)
    const ig = page.getByRole('link', { name: new RegExp(t.instagramLink) })
    await expect(ig).toHaveAttribute('target', '_blank')
    await expect(ig).toHaveAttribute('rel', /noopener/)
    await expect(page.getByRole('link', { name: t.orgLink })).toHaveAttribute('href', `/${locale}/partners`)
    await expect(page.getByRole('link', { name: t.faqLink })).toHaveAttribute('href', `/${locale}/faq`)
    await expect(page.getByRole('contentinfo').getByRole('link', { name: messages[locale].footer.contact })).toBeVisible()
  }
})
