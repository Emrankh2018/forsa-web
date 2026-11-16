import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { messages } from '../packages/shared/src/messages'

/** Phase 0 proof: the empty shell opens in both languages, with the right direction and fonts. */

function watchConsole(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

test('the bare address goes to Arabic', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/ar$/)
})

for (const locale of ['ar', 'en'] as const) {
  const t = messages[locale]

  test(`${locale}: shell renders with language, direction and fonts`, async ({ page }) => {
    const errors = watchConsole(page)
    await page.goto(`/${locale}`)
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', locale)
    await expect(html).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.shell.headline)
    await expect(page).toHaveTitle(t.meta.title)
    // Preview builds are never indexed.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    // Fonts: Amiri for the headline, IBM Plex for text.
    const headingFont = await page.getByRole('heading', { level: 1 }).evaluate((el) => getComputedStyle(el).fontFamily)
    expect(headingFont.toLowerCase()).toContain('amiri')
    const bodyFont = await page.locator('main p').first().evaluate((el) => getComputedStyle(el).fontFamily)
    expect(bodyFont.toLowerCase()).toContain('plex')
    // Nothing overflows sideways at any width.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    expect(errors).toEqual([])
  })

  test(`${locale}: language switch keeps the page and changes direction`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await page.getByRole('link', { name: t.common.languageSwitch }).click()
    const other = locale === 'ar' ? 'en' : 'ar'
    await expect(page).toHaveURL(new RegExp(`/${other}$`))
    await expect(page.locator('html')).toHaveAttribute('dir', other === 'ar' ? 'rtl' : 'ltr')
  })

  test(`${locale}: keyboard reaches skip link, home and language switch`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: t.common.skipToContent })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: t.common.homeLabel })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: t.common.languageSwitch })).toBeFocused()
  })

  test(`${locale}: unknown address shows the not-found page`, async ({ page }) => {
    const res = await page.goto(`/${locale}/no-such-page`)
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.notFound.title)
  })

  test(`${locale}: no accessibility violations`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await page.waitForTimeout(700) // let the first-line draw finish
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
}
