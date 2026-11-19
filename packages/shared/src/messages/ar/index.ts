import { arSite } from './site'
import { arUi } from './ui'
import { arLearn } from './learn'
import { arPartners } from './partners'
import { arPages } from './pages'
import { arApp } from './app'
import { arFlows } from './flows'
import { arMore } from './more'

/**
 * Arabic interface text (the default language). Every visible string lives here or in the English
 * file; components never hold text. Wording follows production/STORY-AND-FACTS.md sections 7 and 8.
 */
export const ar = {
  meta: {
    title: 'فرصة',
    description: 'فرصة تجهّز الخريجين الجدد ومن هم على وشك التخرج لسوق العمل، بمشاريع حقيقية من شركات وورش تدريبية.',
  },
  common: {
    brand: 'فرصة',
    skipToContent: 'انتقل إلى المحتوى',
    languageSwitch: 'English',
    languageSwitchLabel: 'اعرض الموقع بالإنجليزية',
    homeLabel: 'فرصة، الصفحة الرئيسية',
  },
  ...arSite,
  ...arUi,
  ...arLearn,
  ...arPartners,
  ...arPages,
  ...arApp,
  ...arFlows,
  ...arMore,
  errorPage: {
    title: 'تعذّر فتح هذه الصفحة',
    body: 'حدث خطأ من جهتنا، وليس بسببك. حاول مرة أخرى بعد لحظة.',
    retry: 'حاول مرة أخرى',
    home: 'العودة إلى الرئيسية',
    reference: 'إن راسلتنا بشأنه فاذكر هذا الرمز: {code}',
  },
  notFound: {
    title: 'هذا الباب لا يؤدي إلى شيء',
    body: 'الصفحة غير موجودة. ربما تغيّر العنوان أو حُذفت الصفحة.',
    back: 'العودة إلى الرئيسية',
    or: 'أو جرّب:',
  },
} as const
