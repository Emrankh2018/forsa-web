import { test, expect } from '@playwright/test'

/**
 * Roadmap step 7: every internal link on every page opens (no broken doors). Crawls from the home
 * pages and the four areas in both languages, follows each same-site link once, and expects 200.
 */
const starts = ['/ar', '/en', '/ar/me', '/en/org', '/ar/trainer', '/en/admin', '/en/learn', '/ar/guides', '/en/showcase']

test('every internal link opens', async ({ page, request, browserName }, info) => {
  test.skip(info.project.name !== 'desktop' || browserName !== 'chromium', 'one crawl is enough')
  test.setTimeout(420_000)
  await page.addInitScript(() => sessionStorage.setItem('forsa.arrival', 'seen'))
  const seen = new Set<string>()
  const queue = [...starts]
  const broken: string[] = []
  while (queue.length) {
    const path = queue.shift()!
    if (seen.has(path)) continue
    seen.add(path)
    const res = await request.get(path)
    if (res.status() !== 200) {
      broken.push(`${path} -> ${res.status()}`)
      continue
    }
    if (seen.size > 400) continue
    await page.goto(path)
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')!).filter(Boolean))
    for (const h of hrefs) {
      const clean = h.split('#')[0]!
      if (clean && !seen.has(clean) && !clean.startsWith('/_next')) queue.push(clean)
    }
  }
  expect(broken).toEqual([])
  expect(seen.size).toBeGreaterThan(60)
})
