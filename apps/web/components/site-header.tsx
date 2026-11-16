import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'

/** The plain header of the phase 0 shell and the not-found page. */
export async function SiteHeader() {
  const t = await getTranslations('common')
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
      <Link href="/" aria-label={t('homeLabel')} className="inline-flex min-h-11 items-center gap-3 rounded-md">
        <DoorSymbol className="h-9 w-auto" />
        <span className="font-display text-2xl font-bold">{t('brand')}</span>
      </Link>
      <LanguageSwitch />
    </header>
  )
}
