import { test } from '@playwright/test'

/** Saves the share cards. Runs only with OG=1: `OG=1 npx playwright test e2e/og.spec.ts --project=desktop`. */
test.skip(!process.env.OG, 'share cards only on request')

for (const locale of ['ar', 'en'] as const) {
  test(`share card ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 630 })
    await page.goto(`/${locale}/showcase/og`)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('main').screenshot({ path: `apps/web/public/og/forsa-${locale}.png` })
  })
}
