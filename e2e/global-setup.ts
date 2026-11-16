import { chromium } from '@playwright/test'

/**
 * For runs against a protected preview: E2E_SHARE_URL is a temporary Vercel share link (never
 * committed). Opening it once sets the access cookie, which every test then reuses.
 */
export default async function globalSetup() {
  const share = process.env.E2E_SHARE_URL
  if (!share) return
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(share)
  await page.context().storageState({ path: 'test-results/share-state.json' })
  await browser.close()
}
