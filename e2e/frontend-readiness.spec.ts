import { expect, test, type Page } from '@playwright/test'
import { formatDate } from '../packages/shared/src'
import { messages } from '../packages/shared/src/messages'

const locales = ['ar', 'en'] as const
const workshopSlug = 'cv-thirty-seconds'
const courseSlug = 'content-basics'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

async function expectPath(page: Page, pathname: string, query: Record<string, string> = {}) {
  await expect(page).toHaveURL((url) =>
    url.pathname === pathname &&
    Object.keys(query).length === [...url.searchParams].length &&
    Object.entries(query).every(([key, value]) => url.searchParams.get(key) === value),
  )
}

for (const locale of locales) {
  const other = locale === 'ar' ? 'en' : 'ar'
  const t = messages[locale]

  test(locale + ': language link keeps supported filters and return addresses', async ({ page }) => {
    const cases: Array<[string, Record<string, string>]> = [
      ['/projects', { field: 'applied_ai', mode: 'apply', q: 'store' }],
      ['/workshops', { topic: 'career', where: 'online', q: 'CV' }],
      ['/courses', { topic: 'applied_ai' }],
      ['/sign-in', { next: '/workshops/' + workshopSlug + '/book' }],
      ['/join', { as: 'organisation', next: '/partners?way=post_project#interest' }],
      ['/join/organisation', { next: '/partners?way=post_project#interest' }],
      ['/partners', { way: 'post_project' }],
    ]
    for (const [path, query] of cases) {
      await page.goto('/' + locale + path + '?' + new URLSearchParams(query))
      await page.locator('.lang-switch').click()
      await expectPath(page, '/' + other + path, query)
    }
    await expect(page.getByRole('checkbox', { name: messages[other].partners.post_project })).toBeChecked()
    await expect(page).toHaveURL(/#interest$/)
    expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain('NEXT_LOCALE')
  })

  test(locale + ': workshop booking is reachable from the public list after sample sign-in', async ({ page }) => {
    const detail = '/workshops/' + workshopSlug
    await page.goto('/' + locale + '/workshops')
    await page.locator('main a[href$="' + detail + '"]').click()
    await page.getByRole('button', { name: t.workshopsPage.book, exact: true }).click()
    await page.getByRole('dialog').getByRole('link', { name: t.signInPrompt.continue }).click()
    await expectPath(page, '/' + locale + '/sign-in', { next: detail + '/book' })

    const email = page.getByLabel(t.signInFlow.email, { exact: true })
    const send = page.getByRole('button', { name: t.signInFlow.send })
    await send.focus()
    await page.keyboard.press('Enter')
    await expect(email).toBeFocused()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await email.fill('demo@example.test')
    await send.click()

    const code = page.getByLabel(t.signInFlow.code, { exact: true })
    const verify = page.getByRole('button', { name: t.signInFlow.verify })
    await code.fill('12')
    await verify.press('Enter')
    await expect(code).toBeFocused()
    await expect(code).toHaveAttribute('aria-invalid', 'true')
    await code.fill(locale === 'ar' ? '١٢٣٤٥٦' : '123456')
    await verify.press('Enter')
    await expect(page.getByRole('heading', { name: t.signInFlow.doneTitle })).toBeFocused()
    await page.getByRole('link', { name: t.signInFlow.continueBooking }).click()

    await expectPath(page, '/' + locale + detail + '/book')
    await page.getByRole('button', { name: t.booking.reserve }).click()
    await expect(page.getByText(t.booking.reservedTitle)).toBeVisible()
  })

  test(locale + ': role labels fit at narrow widths and the role form keeps the return link', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 })
    const next = '/projects?mode=apply'
    await page.goto('/' + locale + '/join?' + new URLSearchParams({ next }))
    await page.evaluate(() => document.fonts.ready)
    const spans = await page.locator('main li a > span:first-of-type').evaluateAll((els) => els.map((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      const text = range.getBoundingClientRect()
      const item = el.closest('li')!.getBoundingClientRect()
      return { left: text.left - item.left, right: item.right - text.right }
    }))
    expect(spans).toHaveLength(3)
    for (const span of spans) {
      expect(span.left).toBeGreaterThanOrEqual(-1)
      expect(span.right).toBeGreaterThanOrEqual(-1)
    }

    await page.locator('main a[href*="as=participant"]').click()
    await page.getByRole('link', { name: t.account.continue, exact: true }).click()
    await expectPath(page, '/' + locale + '/join/participant', { next })
    await page.getByRole('link', { name: t.account.chooseTitle }).click()
    await expectPath(page, '/' + locale + '/join', { as: 'participant', next })
  })

  test(locale + ': partner and certificate copy describes the preview accurately', async ({ page }) => {
    await page.goto('/' + locale + '/partners')
    await expect(page.getByText(t.partners.formLead)).toBeVisible()
    await expect(page.getByRole('link', { name: t.partners.contactLink })).toHaveAttribute('href', '/' + locale + '/contact#instagram')
    await page.goto('/' + locale + '/faq')
    await page.getByText(t.faq.items.q8, { exact: true }).click()
    await expect(page.getByText(t.faq.items.a8, { exact: true })).toBeVisible()
  })

  test(locale + ': public course links open the sample player', async ({ page }) => {
    await page.goto('/' + locale + '/courses/' + courseSlug)
    await page.getByRole('link', { name: t.coursesPage.enrol, exact: true }).click()
    await expectPath(page, '/' + locale + '/me/learning/courses/' + courseSlug + '/1')
    await expect(page.getByText(t.player.video)).toBeVisible()
  })

  test(locale + ': the fixed share card does not widen a narrow page', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto('/' + locale + '/showcase/og')
    const size = await page.locator('main').evaluate((el) => ({
      document: document.documentElement.scrollWidth,
      canvas: el.scrollWidth,
    }))
    expect(size).toEqual({ document: 320, canvas: 1200 })
    await page.setViewportSize({ width: 1200, height: 630 })
    const card = await page.locator('main').boundingBox()
    expect(card).toMatchObject({ width: 1200, height: 630 })
  })

  test(locale + ': legal drafts are identified before the contents links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const path of ['/privacy', '/terms']) {
      await page.goto('/' + locale + path)
      await page.evaluate(() => document.fonts.ready)
      const notice = page.getByRole('complementary', { name: t.legal.draft })
      const contents = page.getByRole('navigation', { name: t.guidesPage.onThisPage })
      await expect(notice).toBeInViewport()
      const [noticeBox, contentsBox] = await Promise.all([notice.boundingBox(), contents.boundingBox()])
      expect(noticeBox!.y + noticeBox!.height).toBeLessThan(contentsBox!.y)
    }
  })
}

test('lesson progress survives reload and resumes the first unfinished lesson', async ({ page }) => {
  const prefix = '/en/me/learning'
  const lesson = prefix + '/courses/' + courseSlug
  const t = messages.en
  await page.goto(lesson + '/5')
  await page.getByRole('button', { name: t.player.markDone }).click()
  await page.reload()
  await expect(page.getByText('3 of 5 lessons', { exact: true })).toBeVisible()
  await page.goto(prefix)
  await expect(page.getByText('3 of 5 lessons', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: t.learningPage.continue })).toHaveAttribute('href', lesson + '/3')
  for (const num of [3, 4]) {
    await page.goto(lesson + '/' + num)
    await page.getByRole('button', { name: t.player.markDone }).click()
  }
  await page.goto(prefix)
  await expect(page.getByText(t.player.completeTitle)).toBeVisible()
  await expect(page.getByRole('link', { name: t.learningPage.continue })).toHaveCount(0)
})

test('lesson progress stays available during navigation when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked') } })
  })
  const prefix = '/en/me/learning'
  await page.goto(prefix + '/courses/' + courseSlug + '/3')
  await page.getByRole('button', { name: messages.en.player.markDone }).click()
  await page.locator('nav a[href="' + prefix + '"]').click()
  await expectPath(page, prefix)
  await expect(page.getByText('3 of 5 lessons', { exact: true })).toBeVisible()
})

test('manual payment actions update the visible order and the selected filters', async ({ page }) => {
  const t = messages.en.adminLists.orders
  await page.goto('/en/admin/orders')
  const filters = page.getByRole('group')
  const yousef = page.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Yousef' }) })
  const hamad = page.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Hamad' }) })

  await filters.getByRole('button', { name: t.states.reserved, exact: true }).click()
  await yousef.getByRole('button', { name: t.markPaid }).click()
  await expect(yousef).toHaveCount(0)
  await expect(page.getByRole('status').filter({ hasText: 'Yousef' })).toBeFocused()
  await hamad.getByRole('button', { name: t.waive }).click()
  await expect(hamad).toHaveCount(0)

  await filters.getByRole('button', { name: t.states.paid, exact: true }).click()
  await expect(yousef.getByText(t.states.paid, { exact: true })).toBeVisible()
  await filters.getByRole('button', { name: t.states.waived, exact: true }).click()
  await expect(hamad.getByText(t.states.waived, { exact: true })).toBeVisible()
})

test('the company project review includes the selected mode, field and acceptance criteria', async ({ page }) => {
  const t = messages.en
  await page.goto('/en/org/new-project')
  await expect(page.locator('form:not([inert])')).toBeVisible()
  const next = page.getByRole('button', { name: t.org.next, exact: true })
  await page.getByLabel(t.org.fTitle).fill('Review a sample project')
  await page.getByLabel(t.org.fBrief).fill('Help our company put together a campaign for its upcoming community event.')
  await page.getByLabel(t.org.fField).selectOption('applied_ai')
  await next.click()
  await page.getByLabel(t.org.fDeliverables).fill('A campaign plan and two drafts')
  await page.getByLabel(t.org.fAcceptance).fill('Use our approved colours')
  await page.getByLabel(t.org.fSteps).fill('Research\nPlan\nDraft')
  await next.click()
  await page.locator('input[name="mode"][value="apply"]').check()
  await page.getByLabel(t.org.fApplyBy).fill('2027-01-10')
  await page.getByLabel(t.org.fDue).fill('2027-01-20')
  await next.click()

  const summary = page.locator('form dl')
  await expect(summary.getByText(t.project.modeApply, { exact: true })).toBeVisible()
  await expect(summary.getByText('Applied AI', { exact: true })).toBeVisible()
  await expect(summary.getByText('Use our approved colours')).toBeVisible()
  await expect(summary.getByText(formatDate('2027-01-10', 'en', { year: 'numeric', month: 'long', day: 'numeric' }))).toBeVisible()

  await page.getByRole('button', { name: t.org.previous }).click()
  await page.locator('input[name="mode"][value="open"]').check()
  await next.click()
  await expect(summary.getByText(t.project.modeOpen, { exact: true })).toBeVisible()
  await expect(summary.getByText(t.org.fApplyBy, { exact: true })).toHaveCount(0)
})

test('pending sample workshops and projects are outside the public catalogues', async ({ page }) => {
  await page.goto('/en/trainer')
  const links = page.locator('main li')
  await expect(links.filter({ hasText: 'A LinkedIn profile that introduces you' })).toContainText(messages.en.app.state.published)
  await expect(links.filter({ hasText: 'Practise a job interview' })).toContainText(messages.en.app.state.awaiting_approval)
  for (const path of ['/workshops/interview-practice', '/workshops/interview-practice/book', '/projects/takeaway-order-campaign']) {
    expect((await page.goto('/en' + path))?.status()).toBe(404)
  }
  for (const [path, name] of [['/admin/training', 'Practise a job interview'], ['/admin/projects', 'A campaign for takeaway orders']]) {
    await page.goto('/en' + path)
    await expect(page.getByRole('rowheader', { name })).toBeVisible()
  }
  await page.goto('/en/sessions/cv-clinic/book')
  await expect(page.getByText(/sample week starting December 13, 2026/)).toBeVisible()
})

test('workshop tickets show the right sample link and full workshops stay closed', async ({ page }) => {
  const t = messages.en
  for (const slug of [workshopSlug, 'linkedin-profile']) {
    await page.goto('/en/workshops/' + slug + '/book')
    await page.getByRole('button', { name: t.booking.reserve }).click()
    await page.getByRole('button', { name: t.booking.simulate }).click()
    await expect(page.getByText(t.booking.meetingLink)).toBeVisible()
    await expect(page.getByText('https://example.com/meet/' + slug, { exact: true })).toBeVisible()
  }
  await page.goto('/en/workshops/ai-for-marketing')
  await expect(page.getByRole('button', { name: t.workshopsPage.book, exact: true })).toHaveCount(0)
  expect((await page.goto('/en/workshops/ai-for-marketing/book'))?.status()).toBe(404)
})

test('trainer application completion carries the requested return address', async ({ page }) => {
  const t = messages.en
  const next = '/partners?way=give_workshop#interest'
  await page.goto('/en/join/trainer?' + new URLSearchParams({ next }))
  await expect(page.locator('form:not([inert])')).toBeVisible()
  await page.getByLabel(t.trainerApp.fullName).fill('Sample Trainer')
  await page.getByLabel(t.trainerApp.expertise).fill('Interview preparation')
  await page.getByLabel(t.trainerApp.bio).fill('I run sample interview workshops and give feedback on practice answers.')
  await page.getByLabel(t.trainerApp.topics).fill('Answering interview questions')
  await page.getByRole('checkbox', { name: t.trainerApp.consent }).check()
  await page.getByRole('button', { name: t.trainerApp.submit }).click()
  await expect(page.getByText(t.trainerApp.reviewTitle)).toBeVisible()
  await page.getByRole('link', { name: t.account.backTo }).click()
  await expectPath(page, '/en/partners', { way: 'give_workshop' })
  await expect(page).toHaveURL(/#interest$/)
})

test('client-only forms stay inert without JavaScript and catalogue search still works', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: 'reduce' })
  try {
    const page = await context.newPage()
    for (const locale of locales) {
      for (const path of ['/sign-in?next=/projects', '/join/organisation', '/join/trainer', '/org/new-project']) {
        await page.goto('/' + locale + path)
        await expect(page.locator('form')).toHaveAttribute('inert', '')
        await expect(page.locator('form')).toHaveAttribute('method', 'post')
        const fallback = page.locator('noscript p')
        await expect(fallback).toBeVisible()
        await expect(fallback).toHaveText(messages[locale].forms.requiresScript)
        expect(await page.locator('form input').first().evaluate((el) => {
          el.focus()
          return document.activeElement === el
        })).toBe(false)
      }
    }
    await page.goto('/en/projects?mode=apply')
    await page.getByRole('searchbox').fill('store')
    await page.getByRole('button', { name: messages.en.projectsPage.apply }).click()
    await expectPath(page, '/en/projects', { mode: 'apply', q: 'store' })
  } finally {
    await context.close()
  }
})
