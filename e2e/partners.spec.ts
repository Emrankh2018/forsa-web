import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { messages } from '../packages/shared/src/messages'

/**
 * The partner interest form. With E2E_DB=1 the site is connected to the dev database and a valid
 * form must be stored (success shown). Without it, the form must say honestly that sending is not
 * set up, and keep what was typed.
 */
const withDb = process.env.E2E_DB === '1'

for (const locale of ['ar', 'en'] as const) {
  const t = messages[locale].partners

  test(`${locale}: wrong input shows each error and keeps what was typed`, async ({ page }) => {
    await page.goto(`/${locale}/partners`)
    await page.getByLabel(t.orgName).fill('شركة تجريبية للاختبار')
    await page.getByLabel(t.email).fill('not-an-email')
    await page.getByRole('button', { name: t.send }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText(t.errorSummary)
    await expect(page.locator('#contactName-error')).toHaveText(t.errors.contactName)
    await expect(page.locator('#email-error')).toHaveText(t.errors.email)
    await expect(page.locator('#ways-error')).toHaveText(t.errors.ways)
    await expect(page.getByLabel(t.orgName)).toHaveValue('شركة تجريبية للاختبار')
    await expect(page.getByLabel(t.email)).toHaveValue('not-an-email')
    await expect(page.getByLabel(t.email)).toHaveAttribute('aria-invalid', 'true')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })

  test(`${locale}: a way chosen on the page is ticked in the form`, async ({ page }) => {
    await page.goto(`/${locale}/partners`)
    await page.getByRole('link', { name: t.give_workshop }).click()
    await expect(page).toHaveURL(/way=give_workshop/)
    await expect(page.getByRole('checkbox', { name: t.give_workshop })).toBeChecked()
  })

  test(`${locale}: a valid form is ${withDb ? 'stored' : 'refused honestly when no database is set up'}`, async ({ page }, info) => {
    await page.goto(`/${locale}/partners`)
    const stamp = `${info.project.name}-${locale}-${Date.now()}`
    await page.getByLabel(t.orgName).fill(`Test organisation ${stamp}`)
    await page.getByLabel(t.contactName).fill('Test Person')
    await page.getByLabel(t.email).fill(`e2e+${stamp}@example.com`)
    await page.getByRole('checkbox', { name: t.post_project }).check()
    await page.getByRole('button', { name: t.send }).click()
    if (withDb) {
      await expect(page.getByText(t.successTitle)).toBeVisible()
    } else {
      await expect(page.locator('main').getByRole('alert')).toContainText(t.errors.unavailable)
      await expect(page.getByLabel(t.contactName)).toHaveValue('Test Person')
    }
  })
}
