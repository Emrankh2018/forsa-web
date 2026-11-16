import { test } from '@playwright/test'

/**
 * Evidence screenshots: full pages at phone and desktop width in both languages.
 * Run with CAPTURE=1 (and CAPTURE_ROUTES="home,projects,guides/cv" to limit; no leading slash, because Git Bash rewrites those); writes to docs/evidence/.
 */
test.skip(!process.env.CAPTURE, 'capture only on request')

const routes = (process.env.CAPTURE_ROUTES ?? 'home').split(',').map((r) => r.trim().replace(/^\/+/, ''))
const widths = [['phone', 390, 844], ['desktop', 1366, 900]] as const

for (const route of routes) {
  for (const locale of ['ar', 'en'] as const) {
    for (const [label, width, height] of widths) {
      test(`${route} ${locale} ${label}`, async ({ page }) => {
        await page.addInitScript(() => sessionStorage.setItem('forsa.arrival', 'seen'))
        await page.setViewportSize({ width, height })
        await page.goto(`/${locale}${route === 'home' ? '' : `/${route}`}`)
        await page.waitForTimeout(1200)
        const name = route.replace(/\//g, '-')
        await page.screenshot({ path: `docs/evidence/${name}-${locale}-${label}.png`, fullPage: true })
      })
    }
  }
}
