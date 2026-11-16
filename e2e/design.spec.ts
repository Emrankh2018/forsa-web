import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { messages } from '../packages/shared/src/messages'

/**
 * Phase 1 design gate: every page of both directions opens in both languages at every width, with
 * no console errors, no sideways overflow and no accessibility violations; the arrivals behave.
 */

const pages = ['', '/projects/cafe-launch-campaign', '/projects/gallery-visual-identity', '/me'] as const

function watchConsole(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

/** Mark both arrivals as already seen, so page checks see the page itself. */
async function skipArrivals(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('forsa.arrival.a', '1')
    sessionStorage.setItem('forsa.arrival.b', '1')
  })
}

for (const locale of ['ar', 'en'] as const) {
  test(`${locale}: the gate lists both directions`, async ({ page }) => {
    await page.goto(`/${locale}/design`)
    const g = messages[locale].design.gate
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(g.title)
    await expect(page.getByRole('heading', { level: 2, name: g.aName })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: g.bName })).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })

  for (const dir of ['a', 'b'] as const) {
    for (const path of pages) {
      test(`${locale} ${dir}${path || ' home'}: renders cleanly`, async ({ page }) => {
        await skipArrivals(page)
        const errors = watchConsole(page)
        const res = await page.goto(`/${locale}/design/${dir}${path}`)
        expect(res?.status()).toBe(200)
        await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.getByText(messages[locale].design.sample)).toBeVisible()
        await expect(page.locator('.arrival')).toHaveCount(0)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow).toBeLessThanOrEqual(0)
        await page.waitForTimeout(400)
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([])
        expect(errors).toEqual([])
      })
    }
  }
}

test('a full project shows a disabled action', async ({ page }) => {
  await skipArrivals(page)
  await page.goto('/ar/design/b/projects/gallery-visual-identity')
  await expect(page.getByRole('link', { name: messages.ar.design.project.fullCta })).toHaveAttribute('aria-disabled', 'true')
})

for (const dir of ['a', 'b'] as const) {
  test(`arrival ${dir}: plays once, ends on a key press, never traps focus`, async ({ page }) => {
    await page.goto(`/ar/design/${dir}`)
    const overlay = page.locator('.arrival')
    await expect(overlay).toBeVisible()
    await expect(overlay).toHaveAttribute('aria-hidden', 'true')
    // The page is rendered underneath the whole time.
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached()
    await page.keyboard.press('Tab')
    await expect(overlay).toHaveCount(0, { timeout: 2000 })
    // Second visit in the same session: no arrival.
    await page.goto(`/ar/design/${dir}`)
    await expect(page.locator('.arrival')).toHaveCount(0)
    // Replay on request.
    await page.goto(`/ar/design/${dir}?intro=1`)
    await expect(page.locator('.arrival')).toBeVisible()
  })

  test(`arrival ${dir}: ends by itself`, async ({ page }) => {
    await page.goto(`/en/design/${dir}`)
    await expect(page.locator('.arrival')).toHaveCount(0, { timeout: 6000 })
  })

  test(`arrival ${dir}: never plays under reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/ar/design/${dir}?intro=1`)
    await expect(page.locator('.arrival')).toHaveCount(0)
  })
}
