import type { Messages } from '../types'
import { enDesign } from './design'

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
  shell: {
    label: 'Under construction',
    headline: 'Your first experience starts here',
    lead: 'The Forsa platform is being rebuilt. Real projects from companies, and workshops that get you ready for work.',
    note: 'This is a preview build only. It collects no data.',
    designLink: 'See the two design directions',
  },
  design: enDesign,
  notFound: {
    title: 'Page not found',
    body: 'The address may have changed or the page was removed.',
    back: 'Back to home',
  },
} satisfies Messages
