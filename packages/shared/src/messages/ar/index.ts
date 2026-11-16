import { arDesign } from './design'

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
  shell: {
    label: 'قيد البناء',
    headline: 'خبرتك الأولى تبدأ من هنا',
    lead: 'منصة فرصة تُبنى الآن من جديد. مشاريع حقيقية من شركات، وورش تجهّزك لسوق العمل.',
    note: 'هذه نسخة تجريبية للمعاينة فقط، ولا تجمع أي بيانات.',
    designLink: 'شاهد اتجاهي التصميم',
  },
  design: arDesign,
  notFound: {
    title: 'الصفحة غير موجودة',
    body: 'ربما تغيّر العنوان أو حُذفت الصفحة.',
    back: 'العودة إلى الرئيسية',
  },
} as const
