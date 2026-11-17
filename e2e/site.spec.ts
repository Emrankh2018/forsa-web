import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { messages } from '../packages/shared/src/messages'

/**
 * Phase 2 proof: every public page opens cleanly in both languages at every width (status, h1,
 * direction, no sideways overflow, no console errors, axe clean), and journey 1 reaches the sign-in
 * prompt and comes back to the page it started from.
 */

const pages = [
  '',
  '/projects',
  '/projects?field=applied_ai',
  '/projects?q=zzzz-nothing',
  '/projects/cafe-launch-campaign',
  '/projects/gallery-visual-identity',
  '/learn',
  '/workshops',
  '/workshops/cv-thirty-seconds',
  '/workshops/ai-for-marketing',
  '/sessions',
  '/courses',
  '/courses/content-basics',
  '/guides',
  '/guides/cv',
  '/guides/linkedin',
  '/guides/interview',
  '/partners',
  '/trainers',
  '/about',
  '/faq',
  '/privacy',
  '/terms',
  '/sign-in?next=/projects',
  '/join',
  '/join?as=organisation&next=/partners',
  '/showcase',
]

function watchConsole(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('forsa.arrival', 'seen'))
})

for (const locale of ['ar', 'en'] as const) {
  for (const path of pages) {
    test(`${locale}${path || '/'}: renders cleanly`, async ({ page }) => {
      const errors = watchConsole(page)
      const res = await page.goto(`/${locale}${path}`)
      expect(res?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBeLessThanOrEqual(0)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([])
      expect(errors).toEqual([])
    })
  }

  test(`${locale}: journey 1 — browse, open a project, ask to join, reach sign-in, come back`, async ({ page }) => {
    const t = messages[locale]
    await page.goto(`/${locale}`)
    // No menu: the hall's doors are the way in.
    await expect(page.getByRole('navigation', { name: t.nav.main })).toHaveCount(0)
    await page.locator('.hall a[href$="/projects"]').click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.projectsPage.title)

    // Filter to apply-first projects, then open the first one with seats left.
    await page.getByRole('group', { name: t.projectsPage.mode }).getByRole('link', { name: t.project.modeApply }).click()
    await expect(page).toHaveURL(/mode=apply/)
    await page.locator('main a[href*="/projects/store-support-assistant"]').click()
    await expect(page).toHaveURL(/\/projects\/store-support-assistant$/)

    // Applying needs an account: the soft prompt explains and offers sign-in or not now.
    await page.getByRole('button', { name: t.project.applyCta }).click()
    const dialog = page.getByRole('dialog', { name: t.signInPrompt.title })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: t.signInPrompt.notNow }).click()
    await expect(dialog).toBeHidden()

    // Saving asks too; this time continue to sign-in.
    await page.getByRole('button', { name: t.project.save }).click()
    await page.getByRole('dialog', { name: t.signInPrompt.title }).getByRole('link', { name: t.signInPrompt.continue }).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/sign-in\\?next=%2Fprojects%2Fstore-support-assistant`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.account.soonTitle)

    // And back to exactly where the visitor was.
    await page.getByRole('link', { name: t.account.backTo }).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects/store-support-assistant$`))
  })

  test(`${locale}: keyboard alone opens and closes the sign-in prompt`, async ({ page }) => {
    const t = messages[locale]
    await page.goto(`/${locale}/workshops/cv-thirty-seconds`)
    const book = page.getByRole('button', { name: t.workshopsPage.book })
    await book.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: t.signInPrompt.title })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(book).toBeFocused()
  })

  test(`${locale}: a sign-in link from elsewhere never sends you off the site`, async ({ page }) => {
    await page.goto(`/${locale}/sign-in?next=https://evil.example`)
    await expect(page.getByRole('link', { name: messages[locale].account.backTo })).toHaveCount(0)
  })
}

test('moving between pages passes a threshold (view transition runs on navigation)', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'view transitions are checked in Chromium')
  await page.goto('/en')
  const seen = page.evaluate(
    () =>
      new Promise<string[]>((resolve) => {
        const names = new Set<string>()
        const tick = () => {
          for (const a of document.getAnimations()) {
            const pe = (a.effect as KeyframeEffect | null)?.pseudoElement
            if (pe && pe.includes('view-transition')) names.add(`${pe} ${(a as CSSAnimation).animationName ?? ''}`)
          }
        }
        const id = setInterval(tick, 16)
        setTimeout(() => { clearInterval(id); resolve([...names]) }, 1200)
      }),
  )
  await page.locator('.hall a[href$="/learn"]').click()
  const names = await seen
  expect(names.some((n) => n.includes('threshold-open'))).toBe(true)
  await expect(page).toHaveURL(/\/en\/learn$/)
})

for (const locale of ['ar', 'en'] as const) {
  test(`${locale}: come in, choose a door, and move between rooms by the doors`, async ({ page }) => {
    const t = messages[locale]
    await page.goto(`/${locale}/projects`)
    await page.getByRole('link', { name: t.nav.enterLabel }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.account.chooseTitle)
    await page.locator('main a[href*="as=trainer"]').click()
    await expect(page).toHaveURL(/as=trainer/)
    await expect(page.getByRole('status')).toContainText(t.account.chosen.replace('{door}', t.account.trainer))
    await expect(page.locator('main a[href*="as=trainer"]')).toHaveAttribute('aria-current', 'true')
    // The doors at the end of the page lead to the other rooms; your own door is marked current here.
    const rooms = page.getByRole('navigation', { name: t.footer.roomsTitle })
    await expect(rooms.locator('a[href$="/join"]')).toHaveAttribute('aria-current', 'page')
    await rooms.locator('a[href$="/learn"]').click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/learn$`))
    await expect(page.getByRole('navigation', { name: t.footer.roomsTitle }).locator('a[href$="/learn"]')).toHaveAttribute('aria-current', 'page')
  })
}

