import { defineConfig, devices } from '@playwright/test'

/**
 * Browser journeys. Runs against the production build on port 8765 (4173 is blocked on the owner's
 * machine). Three widths from plan V4 section 11: phone 390, tablet 820, desktop 1366.
 * Set E2E_BASE_URL to run against a preview deployment instead.
 */
const port = 8765
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run start', url: `${baseURL}/ar`, reuseExistingServer: !process.env.CI, timeout: 120_000 },
})
