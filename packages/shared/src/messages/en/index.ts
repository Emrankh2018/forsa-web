import type { Messages } from '../types'
import { enSite } from './site'
import { enUi } from './ui'
import { enLearn } from './learn'
import { enPartners } from './partners'
import { enPages } from './pages'
import { enApp } from './app'
import { enFlows } from './flows'
import { enMore } from './more'

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
  ...enLearn,
  ...enPartners,
  ...enPages,
  ...enApp,
  ...enFlows,
  ...enMore,
  errorPage: {
    title: 'This page could not open',
    body: 'Something went wrong on our side, not yours. Try again in a moment.',
    retry: 'Try again',
    home: 'Back to home',
    reference: 'If you write to us about it, quote this code: {code}',
  },
  notFound: {
    title: 'This door leads nowhere',
    body: 'The page does not exist. The address may have changed or the page was removed.',
    back: 'Back to home',
    or: 'Or try:',
  },
} satisfies Messages
