import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { messages } from '../packages/shared/src/messages'

/**
 * Signed-in area prototypes (sample data, nothing saved): every page opens cleanly in both
 * languages at every width, says it is a prototype, and the main interactions respond.
 */

const pages = [
  '/me', '/me/projects', '/me/projects/cafe-launch-campaign', '/me/learning', '/me/saved', '/me/invitations',
  '/me/notices', '/me/settings', '/me/profile', '/me/learning/courses/content-basics/3',
  '/org', '/org/projects', '/org/projects/cafe-launch-campaign', '/org/projects/loyalty-programme',
  '/org/projects/cafe-launch-campaign/review/p2', '/org/new-project', '/org/talent', '/org/team', '/org/settings',
  '/trainer', '/trainer/workshops', '/trainer/availability', '/trainer/courses', '/trainer/sessions', '/trainer/profile', '/trainer/workshops/new', '/trainer/workshops/linkedin-profile/edit',
  '/admin', '/admin/queues', '/admin/settings', '/admin/people', '/admin/guides', '/admin/audit',
  '/admin/organisations', '/admin/projects', '/admin/training', '/admin/orders', '/admin/content',
]

function watchConsole(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

for (const locale of ['ar', 'en'] as const) {
  for (const path of pages) {
    test(`${locale}${path}: prototype renders cleanly`, async ({ page }) => {
      const errors = watchConsole(page)
      const res = await page.goto(`/${locale}${path}`)
      expect(res?.status()).toBe(200)
      await expect(page.getByText(messages[locale].app.prototype)).toBeVisible()
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBeLessThanOrEqual(0)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([])
      expect(errors).toEqual([])
    })
  }
}

/**
 * Unknown items inside the signed-in areas answer 404 with the not-found page, never 500.
 * Audit 2026-11-19: these answered 500 on the live site ("Page changed from static to dynamic at
 * runtime, reason: headers") because the area layouts' metadata did not pass the locale.
 */
const unknownInAreas = [
  '/me/projects/no-such-project', '/me/learning/courses/content-basics/99',
  '/org/projects/no-such-project', '/org/projects/cafe-launch-campaign/review/no-such-hand-in',
  '/trainer/workshops/no-such-workshop/edit',
]
for (const locale of ['ar', 'en'] as const) {
  for (const path of unknownInAreas) {
    test(`${locale}${path}: answers 404, not 500`, async ({ page }) => {
      const res = await page.goto(`/${locale}${path}`)
      expect(res?.status()).toBe(404)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages[locale].notFound.title)
    })
  }
}

test.describe('interactions', () => {
  const t = messages.en

  test('workspace: tabs work by keyboard, a step can be ticked, a hand-in responds', async ({ page }) => {
    await page.goto('/en/me/projects/cafe-launch-campaign')
    const stepsTab = page.getByRole('tab', { name: t.workspace.tabs.steps })
    await expect(stepsTab).toHaveAttribute('aria-selected', 'true')
    await stepsTab.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: t.workspace.tabs.updates })).toBeFocused()
    await expect(page.getByRole('tab', { name: t.workspace.tabs.updates })).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('tab', { name: t.workspace.tabs.steps }).click()
    await page.getByRole('button', { name: t.workspace.markDone }).click()
    await expect(page.getByRole('button', { name: t.workspace.undo })).toBeVisible()
    await page.getByRole('tab', { name: t.workspace.tabs.handIn }).click()
    await page.getByRole('button', { name: t.workspace.submit }).click()
    await expect(page.getByText(t.forms.errors.handInShort)).toBeVisible()
    await page.getByLabel(t.workspace.handInText).fill('The plan, three posts and the video script are attached, with notes on each.')
    await page.getByRole('button', { name: t.workspace.submit }).click()
    await expect(page.getByText(t.workspace.submittedTitle)).toBeVisible()
    await expect(page.getByText(t.app.savedLocally)).toBeVisible()
  })

  test('post a project: four steps, values kept going back, then sent', async ({ page }) => {
    await page.goto('/en/org/new-project')
    await page.getByRole('button', { name: t.org.next }).click()
    await expect(page.getByText(t.forms.errors.briefShort)).toBeVisible()
    await page.getByLabel(t.org.fTitle).fill('A menu photo shoot')
    await page.getByLabel(t.org.fBrief).fill('We need fresh photos of our ten best-selling dishes for the new menu and our delivery apps.')
    await page.getByRole('button', { name: t.org.next }).click()
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(t.org.wizardSteps.work)
    await page.getByRole('button', { name: t.org.previous }).click()
    await expect(page.getByLabel(t.org.fTitle)).toHaveValue('A menu photo shoot')
    await page.getByRole('button', { name: t.org.next }).click()
    await page.getByLabel(t.org.fDeliverables).fill('Ten photos\nA shot list')
    await page.getByLabel(t.org.fAcceptance).fill('Natural light, no filters')
    await page.getByLabel(t.org.fSteps).fill('Plan the shots\nShoot\nEdit\nHand in')
    await page.getByRole('button', { name: t.org.next }).click()
    await page.getByLabel(t.org.fDue).fill('2027-01-20')
    await page.getByRole('button', { name: t.org.next }).click()
    await expect(page.getByText('A menu photo shoot')).toBeVisible()
    await page.getByRole('button', { name: t.org.sendForApproval }).click()
    await expect(page.getByText(t.org.sentTitle)).toBeVisible()
  })

  test('applicants: no more than the seats can be selected', async ({ page }) => {
    await page.goto('/en/org/projects/loyalty-programme')
    const select = page.getByRole('button', { name: t.org.select, exact: true })
    for (let i = 0; i < 3; i++) await select.first().click()
    await expect(page.getByRole('button', { name: t.org.selected, exact: true })).toHaveCount(3)
    await expect(select).toBeDisabled()
    await page.getByRole('button', { name: t.org.confirmSelection }).click()
    await expect(page.getByText(t.app.savedLocally)).toBeVisible()
  })

  test('review: a decision is required, then the review is sent', async ({ page }) => {
    await page.goto('/en/org/projects/cafe-launch-campaign/review/p3')
    await expect(page.getByRole('button', { name: t.org.sendReview })).toBeDisabled()
    await page.getByLabel(t.org.changes).check()
    await page.getByLabel(t.org.feedback).fill('Add the opening date to the video too.')
    await page.getByRole('button', { name: t.org.sendReview }).click()
    await expect(page.getByText(t.org.reviewSent)).toBeVisible()
  })

  test('invitation: accepting releases contact (in the prototype, nothing saved)', async ({ page }) => {
    await page.goto('/en/me/invitations')
    await page.getByRole('button', { name: t.invitations.accept }).click()
    await expect(page.getByRole('status')).toContainText(t.invitations.acceptedNote)
  })

  test('come in: a chosen door leads inside its area', async ({ page }) => {
    await page.goto('/en/join?as=organisation')
    await page.getByRole('link', { name: t.app.lookInside }).click()
    await expect(page).toHaveURL(/\/en\/org$/)
  })
  test('onboarding: each step is checked before moving on', async ({ page }) => {
    await page.goto('/en/join/participant')
    await page.getByRole('button', { name: t.org.next }).click()
    await expect(page.getByText(t.forms.errors.name).first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(t.onboarding.steps.about)
  })

  test('workshop booking: hold a seat, then the ticket', async ({ page }) => {
    await page.goto('/en/workshops/cv-thirty-seconds/book')
    await page.getByRole('button', { name: t.booking.reserve }).click()
    await expect(page.getByText(t.booking.reservedTitle)).toBeVisible()
    await page.getByRole('button', { name: t.booking.simulate }).click()
    await expect(page.getByText(t.booking.ticketConfirmed)).toBeVisible()
  })

  test('1-to-1: a time must be chosen before booking', async ({ page }) => {
    await page.goto('/en/sessions/cv-clinic/book')
    await page.getByRole('button', { name: t.slots.confirm }).click()
    await expect(page.getByText(t.forms.errors.pickSlot)).toBeVisible()
    await page.locator('input[name="slot"]').first().check({ force: true })
    await page.getByRole('button', { name: t.slots.confirm }).click()
    await expect(page.getByText(t.slots.doneTitle)).toBeVisible()
  })

  test('settings: deleting the account needs the exact word', async ({ page }) => {
    await page.goto('/en/me/settings')
    await page.getByLabel(t.settings.deleteLabel).fill('remove')
    await page.getByRole('button', { name: t.settings.deleteCta }).click()
    await expect(page.getByText(t.forms.errors.deleteConfirm)).toBeVisible()
    await page.getByLabel(t.settings.deleteLabel).fill(t.settings.deleteWord)
    await page.getByRole('button', { name: t.settings.deleteCta }).click()
    await expect(page.getByText(t.settings.deletedTitle)).toBeVisible()
  })

  test('testing kit: answers are copied as text, nothing is sent', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are granted in Chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/en/test')
    await page.getByRole('radio', { name: t.testKit.easyScale.split('|')[3] }).first().check({ force: true })
    await page.getByLabel(t.testKit.overall2).fill('Bigger buttons')
    await page.getByRole('button', { name: t.testKit.copy }).click()
    await expect(page.getByRole('status').filter({ hasText: t.testKit.copied })).toBeVisible()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text).toContain(t.testKit.tasks.p1)
    expect(text).toContain('Bigger buttons')
  })
  test('profile: a bad link is caught, the public page opens', async ({ page }) => {
    await page.goto('/en/me/profile')
    await page.getByLabel(t.profile.links).fill('www.example')
    await page.getByRole('button', { name: t.profile.save }).click()
    await expect(page.getByText(t.forms.errors.url)).toBeVisible()
    await page.getByLabel(t.profile.links).fill('https://example.com/reem')
    await page.getByRole('button', { name: t.profile.save }).click()
    await expect(page.getByText(t.profile.saved)).toBeVisible()
    await page.getByRole('link', { name: t.profile.seePublic }).click()
    await expect(page).toHaveURL(/\/en\/p\/reem$/)
  })

  test('team: an invitation needs a valid email', async ({ page }) => {
    await page.goto('/en/org/team')
    await page.getByRole('button', { name: t.orgTeam.inviteCta }).click()
    await expect(page.getByText(t.forms.errors.email)).toBeVisible()
    await page.getByLabel(t.orgTeam.email).fill('dana@example.com')
    await page.getByRole('button', { name: t.orgTeam.inviteCta }).click()
    await expect(page.getByText('dana@example.com')).toBeVisible()
  })

  test('sessions: a session length must be 15 to 120 minutes', async ({ page }) => {
    await page.goto('/en/trainer/sessions')
    await page.getByLabel(t.trainerSessions.typeName).fill('Interview practice')
    await page.getByLabel(t.trainerSessions.typeMinutes).fill('5')
    await page.getByRole('button', { name: t.trainerSessions.addCta, exact: true }).click()
    await expect(page.getByText(t.forms.errors.minutes)).toBeVisible()
    await page.getByLabel(t.trainerSessions.typeMinutes).fill('45')
    await page.getByRole('button', { name: t.trainerSessions.addCta, exact: true }).click()
    await expect(page.getByText(t.trainerSessions.added)).toBeVisible()
  })

  test('admin people: filter and search narrow the list', async ({ page }) => {
    await page.goto('/en/admin/people')
    await page.getByRole('button', { name: t.adminPeople.kinds.trainer }).click()
    await expect(page.getByRole('row')).toHaveCount(3)
    await page.getByLabel(t.adminPeople.search).fill('zzz')
    await expect(page.getByText(t.adminPeople.none)).toBeVisible()
  })

  test('admin audit: the CSV download carries every row', async ({ page }) => {
    await page.goto('/en/admin/audit')
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: t.adminAudit.export }).click()])
    expect(download.suggestedFilename()).toBe('forsa-audit.csv')
    const path = await download.path()
    const text = (await import('node:fs')).readFileSync(path, 'utf8')
    expect(text.trim().split('\r\n')).toHaveLength(5)
    expect(text).toContain('Verified organisation')
  })
  test('admin orders: a held seat can be marked paid; the filter narrows the list', async ({ page }) => {
    await page.goto('/en/admin/orders')
    await page.getByRole('button', { name: t.adminLists.orders.states.paid, exact: true }).click()
    await expect(page.getByRole('row')).toHaveCount(2)
    await page.getByRole('button', { name: t.adminLists.all, exact: true }).click()
    await page.getByRole('button', { name: t.adminLists.orders.markPaid }).first().click()
    await expect(page.getByRole('status').filter({ hasText: 'Yousef' })).toBeVisible()
  })

  test('admin organisations: search finds one, and a waiting one can be verified', async ({ page }) => {
    await page.goto('/en/admin/organisations')
    await page.getByLabel(t.adminLists.search).fill('madar')
    await expect(page.getByRole('row')).toHaveCount(2)
    await page.getByRole('button', { name: t.adminLists.organisations.verify }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Madar Solutions' })).toBeVisible()
  })

  test('admin content: a skill needs both languages; online payment stays locked', async ({ page }) => {
    await page.goto('/en/admin/content')
    await expect(page.getByLabel(t.adminLists.content.switchPayments)).toBeDisabled()
    await page.getByRole('button', { name: t.adminLists.content.add, exact: true }).click()
    await expect(page.getByText(t.forms.errors.tooShort).first()).toBeVisible()
    await page.getByLabel(t.adminLists.content.skillAr).fill('تحليل البيانات')
    await page.getByLabel(t.adminLists.content.skillEn).fill('Data storytelling')
    await page.getByRole('button', { name: t.adminLists.content.add, exact: true }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Marketing and media' })).toBeVisible()
  })
  test('trainer: a new workshop is checked, then sent for publishing', async ({ page }) => {
    await page.goto('/en/trainer/workshops')
    await page.getByRole('link', { name: t.trainerArea.newWorkshop }).click()
    await expect(page).toHaveURL(/\/en\/trainer\/workshops\/new$/)
    await page.getByLabel(t.workshopForm.inPerson).check()
    await page.getByRole('button', { name: t.workshopForm.send }).click()
    await expect(page.getByText(t.forms.errors.date)).toBeVisible()
    await page.getByLabel(t.workshopForm.title).fill('Interview practice')
    await page.getByLabel(t.workshopForm.summary).fill('You answer real interview questions and get notes.')
    await page.getByLabel(t.workshopForm.outcomes).fill('Three answers ready')
    await page.getByLabel(t.workshopForm.date).fill('2027-01-12')
    await page.getByRole('textbox', { name: t.workshopForm.place }).fill('Forsa room, Doha')
    await page.getByRole('button', { name: t.workshopForm.send }).click()
    await expect(page.getByText(t.workshopForm.sentTitle)).toBeVisible()
  })
  test('for you: projects in the participant\'s field come first', async ({ page }) => {
    await page.goto('/en/me')
    const cards = page.getByTestId('for-you').getByRole('listitem')
    await expect(cards).toHaveCount(4)
    await expect(cards.first()).toContainText('Marketing and media')
    await expect(cards.last()).toContainText('Applied AI')
  })
})
