import { test } from '@playwright/test'

/** Evidence for the design gate: full-page screenshots. Runs only with CAPTURE=1. */
test.skip(!process.env.CAPTURE, 'capture only on request')

const shots = [
  ['home', ''],
  ['project', '/projects/cafe-launch-campaign'],
  ['me', '/me'],
] as const

for (const dir of ['a', 'b'] as const) {
  for (const locale of ['ar', 'en'] as const) {
    for (const [name, path] of shots) {
      for (const [label, width, height] of [['phone', 390, 844], ['desktop', 1366, 900]] as const) {
        test(`${dir} ${locale} ${name} ${label}`, async ({ page }) => {
          await page.addInitScript(() => {
            sessionStorage.setItem('forsa.arrival.a', '1')
            sessionStorage.setItem('forsa.arrival.b', '1')
          })
          await page.setViewportSize({ width, height })
          await page.goto(`/${locale}/design/${dir}${path}`)
          await page.waitForTimeout(1500)
          await page.screenshot({ path: `docs/phase-1/${dir}-${name}-${locale}-${label}.png`, fullPage: true })
        })
      }
    }
  }
}

test('arrival frames', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  for (const dir of ['a', 'b'] as const) {
    await page.goto(`/ar/design/${dir}?intro=1`)
    for (const ms of [400, 1200, 1900]) {
      await page.waitForTimeout(ms === 400 ? 400 : ms === 1200 ? 800 : 700)
      await page.screenshot({ path: `docs/phase-1/${dir}-arrival-${ms}ms.png` })
    }
  }
})
