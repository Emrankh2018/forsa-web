import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'

/** The site header. Until accounts exist (phase 3) the account links lead to the sign-in page. */
export async function SiteHeader() {
  const t = await getTranslations('nav')
  const c = await getTranslations('common')
  return (
    <header className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-8">
      <Link href="/" aria-label={c('homeLabel')} className="inline-flex min-h-11 items-center gap-3 rounded-md">
        <DoorSymbol className="h-10 w-auto" />
        <span className="font-display text-2xl font-bold">{c('brand')}</span>
      </Link>
      <nav aria-label={t('main')} className="order-last -mx-3 flex w-[calc(100%+1.5rem)] gap-1 overflow-x-auto sm:order-none sm:mx-0 sm:w-auto">
        <Link href="/projects" className="btn-quiet">{t('projects')}</Link>
        <Link href="/learn" className="btn-quiet">{t('learn')}</Link>
        <Link href="/partners" className="btn-quiet">{t('partners')}</Link>
      </nav>
      <div className="ms-auto flex items-center gap-1">
        <LanguageSwitch />
        <Link href="/sign-in" className="btn-quiet hidden sm:inline-flex">{t('signIn')}</Link>
        <Link href="/join" className="btn-arch">{t('join')}</Link>
      </div>
    </header>
  )
}
