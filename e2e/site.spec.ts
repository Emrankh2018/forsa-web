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
  '/guides/networking',
  '/guides/first-week',
  '/guides/portfolio',
  '/partners',
  '/trainers',
  '/about',
  '/faq',
  '/privacy',
  '/terms',
  '/sign-in',
  '/sign-in?next=/projects',
  '/join/participant',
  '/join/organisation',
  '/join/trainer',
  '/workshops/cv-thirty-seconds/book',
  '/sessions/cv-clinic/book',
  '/test',
  '/p/reem',
  '/showcase/states',
  '/workshops?topic=career&where=online',
  '/workshops?q=zzzz-nothing',
  '/courses?topic=applied_ai',
  '/courses?q=zzzz-nothing',
  '/join',
  '/join?as=organisation&next=/partners',
  '/showcase',
  '/showcase/emails',
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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.account.signInTitle)

    // Sign in with a code (prototype: any six digits), checked by the shared rules first.
    await page.getByRole('button', { name: t.signInFlow.send }).click()
    await expect(page.getByText(t.forms.errors.email)).toBeVisible()
    await page.getByLabel(t.signInFlow.email).fill('sara@example.com')
    await page.getByRole('button', { name: t.signInFlow.send }).click()
    await page.getByLabel(t.signInFlow.code).fill('12')
    await page.getByRole('button', { name: t.signInFlow.verify }).click()
    await expect(page.getByText(t.forms.errors.code)).toBeVisible()
    await page.getByLabel(t.signInFlow.code).fill('123456')
    await page.getByRole('button', { name: t.signInFlow.verify }).click()
    await expect(page.getByText(t.signInFlow.doneTitle)).toBeVisible()

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
    const t = messages[locale]
    await page.goto(`/${locale}/sign-in?next=https://evil.example`)
    await page.getByLabel(t.signInFlow.email).fill('sara@example.com')
    await page.getByRole('button', { name: t.signInFlow.send }).click()
    await page.getByLabel(t.signInFlow.code).fill('123456')
    await page.getByRole('button', { name: t.signInFlow.verify }).click()
    await expect(page.getByText(t.signInFlow.doneTitle)).toBeVisible()
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
        setTimeout(() => { clearInterval(id); resolve([...names]) }, 2500)
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

for (const path of ['/ar', '/en/projects', '/ar/workshops/cv-thirty-seconds', '/en/me/projects/cafe-launch-campaign', '/ar/org/new-project']) {
  test(`keyboard: every stop on ${path} shows a visible focus mark`, async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('forsa.arrival', 'seen'))
    await page.goto(path)
    const seen = new Set<string>()
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const cs = getComputedStyle(el)
        const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none'
        // Some links draw focus on a child (the door); accept that too.
        const child = el.querySelector('.door') as HTMLElement | null
        const childVisible = child ? getComputedStyle(child).outlineStyle !== 'none' : false
        return { key: el.outerHTML.slice(0, 80), visible: visible || childVisible }
      })
      if (!info || seen.has(info.key)) continue
      seen.add(info.key)
      expect(info.visible, info.key).toBe(true)
    }
    expect(seen.size).toBeGreaterThan(3)
  })
}

test('guides: the pitch builder times the introduction, the CV checker flags a weak line', async ({ page }) => {
  const t = messages.en
  await page.goto('/en/guides/networking')
  await page.getByLabel(t.pitch.who).fill('A marketing graduate from Qatar University')
  await page.getByLabel(t.pitch.did).fill('I planned a launch campaign for a café')
  await page.getByLabel(t.pitch.want).fill('Looking for a content role')
  await expect(page.getByText(t.pitch.good)).toBeVisible()
  await page.goto('/en/guides/cv')
  await page.getByLabel(t.cvcheck.label).fill('Responsible for social media at the club' + String.fromCharCode(10) + 'Designed three posts, published on the café account')
  await page.getByRole('button', { name: t.cvcheck.check }).click()
  await expect(page.getByText(t.cvcheck.weakStart)).toBeVisible()
  await expect(page.getByText(t.cvcheck.ok)).toBeVisible()
})


test('arrival: the door plays when asked and ends by itself (GSAP is fetched on demand)', async ({ page }) => {
  await page.goto('/en?intro=1')
  await expect(page.locator('.arrival-door')).toBeAttached()
  await expect(page.locator('html')).toHaveAttribute('data-arrival-done', '', { timeout: 4500 })
  await expect(page.locator('.arrival-door')).toHaveCount(0)
})

for (const locale of ['ar', 'en'] as const) {
  test(`${locale}: the arrival plays once per visit, not again when you come back home`, async ({ page }) => {
    const t = messages[locale]
    await page.goto(`/${locale}?intro=1`)
    await expect(page.locator('html')).toHaveAttribute('data-arrival-done', '', { timeout: 4500 })
    // Browse inside the site, then come back home by the logo, as a visitor would.
    await page.getByRole('link', { name: t.nav.enterLabel }).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/join$`))
    // Count every time the door is put back on screen from here on.
    await page.evaluate(() => {
      const w = window as unknown as { replays: number }
      w.replays = 0
      new MutationObserver(() => {
        if (!document.documentElement.hasAttribute('data-arrival-done')) w.replays++
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-arrival-done'] })
    })
    await page.getByRole('link', { name: t.common.homeLabel }).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}$`))
    await expect(page.locator('h1')).toBeVisible()
    await page.waitForTimeout(800)
    expect(await page.evaluate(() => (window as unknown as { replays: number }).replays)).toBe(0)
    await expect(page.locator('.arrival-door')).toHaveCount(0)
  })
}

test('workshops and courses: search and filters narrow the list and keep their address', async ({ page }) => {
  const t = messages.en
  await page.goto('/en/workshops')
  await page.getByLabel(t.listFilters.workshopsSearch).fill('linkedin')
  await page.getByRole('button', { name: t.projectsPage.apply }).click()
  await expect(page).toHaveURL(/\/en\/workshops\?q=linkedin/)
  await expect(page.getByRole('heading', { level: 3, name: /LinkedIn/ }).first()).toBeVisible()
  await page.goto('/en/courses?q=zzzz-nothing')
  await expect(page.getByText(t.listFilters.coursesEmpty)).toBeVisible()
  await page.getByRole('link', { name: t.projectsPage.reset }).first().click()
  await expect(page).toHaveURL(/\/en\/courses$/)
})

test('states: the not-for-your-account screen leads back to the participant page', async ({ page }) => {
  const t = messages.en
  await page.goto('/en/showcase/states')
  await expect(page.getByText(t.notYours.title)).toBeVisible()
  await page.getByRole('link', { name: t.notYours.back }).click()
  await expect(page).toHaveURL(/\/en\/me$/)
})
