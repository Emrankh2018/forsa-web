import type { Messages } from '../types'
import { enSite } from './site'
import { enUi } from './ui'

/** English interface text. Must have exactly the same keys as the Arabic file (checked by type). */
export const en = {
  meta: {
    title: 'Forsa',
    description: 'Forsa gets new graduates and near-graduates ready for the job market, with real projects from companies and practical workshops.',
  },
  common: {
    brand: 'Forsa',
    skipToContent: 'Skip to content',
    languageSwitch: 'العربية',
    languageSwitchLabel: 'View the site in Arabic',
    homeLabel: 'Forsa, home page',
  },
  ...enSite,
  ...enUi,
  notFound: {
    title: 'Page not found',
    body: 'The address may have changed or the page was removed.',
    back: 'Back to home',
  },
} satisfies Messages
