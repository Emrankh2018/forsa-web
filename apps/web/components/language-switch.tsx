'use client'

import { useLocale, useTranslations } from 'next-intl'
import { otherLocale } from '@forsa/shared'
import { Link, usePathname } from '@/i18n/navigation'

/** Same page in the other language. */
export function LanguageSwitch() {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const target = otherLocale(locale)
  return (
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      lang={target}
      title={t('languageSwitchLabel')}
      className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-ink underline-offset-4 hover:underline"
    >
      {t('languageSwitch')}
    </Link>
  )
}
