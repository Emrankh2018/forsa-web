import { writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

/**
 * Largest contentful paint on a simulated mid-range phone: 390 px, CPU slowed 4x, network about
 * "fast 3G plus" (1.6 Mbps down, 150 ms latency). Runs only with PERF=1, in Chromium; writes
 * docs/evidence/perf.json. Plan V4 target: under 2.5 s on public pages.
 */
test.skip(!process.env.PERF, 'performance only on request')
test.describe.configure({ mode: 'serial' })

const routes = ['/ar', '/en', '/ar/projects', '/ar/projects/cafe-launch-campaign', '/ar/learn', '/ar/guides/interview', '/ar/partners']
const results: Array<{ route: string; lcpMs: number; transferKb: number }> = []

for (const route of routes) {
  test(`LCP ${route}`, async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    // First visit in the session: the arrival would cover the page; measure the page itself.
    await page.addInitScript(() => sessionStorage.setItem('forsa.arrival', 'seen'))
    await page.goto(route, { waitUntil: 'load' })
    const lcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let last = 0
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) last = e.startTime
          }).observe({ type: 'largest-contentful-paint', buffered: true })
          setTimeout(() => resolve(last), 1500)
        }),
    )
    const transfer = await page.evaluate(() =>
      performance.getEntriesByType('resource').reduce((n, e) => n + ((e as PerformanceResourceTiming).transferSize || 0), 0) +
      ((performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.transferSize ?? 0),
    )
    results.push({ route, lcpMs: Math.round(lcp), transferKb: Math.round(transfer / 1024) })
    expect(lcp).toBeGreaterThan(0)
  })
}

test.afterAll(() => {
  if (results.length) writeFileSync('docs/evidence/perf.json', JSON.stringify({ measured: new Date().toISOString(), conditions: '390px, CPU x4, 1.6 Mbps / 150 ms, local production build', results }, null, 2))
})
