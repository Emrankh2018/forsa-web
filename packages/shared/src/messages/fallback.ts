/**
 * Text for the last-resort error screen (apps/web/app/global-error.tsx), shown when the root layout
 * itself failed and the normal messages cannot load. Kept apart so that screen stays tiny.
 */
export const fallbackError = {
  ar: { title: 'تعذّر فتح الموقع', body: 'حدث خطأ من جهتنا، وليس بسببك. حاول مرة أخرى بعد لحظة.', retry: 'حاول مرة أخرى', home: 'الرئيسية' },
  en: { title: 'The site could not open', body: 'Something went wrong on our side, not yours. Try again in a moment.', retry: 'Try again', home: 'Home' },
} as const
