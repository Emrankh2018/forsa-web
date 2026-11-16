import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'

export async function HeaderA({ signedIn = false }: { signedIn?: boolean }) {
  const t = await getTranslations('design.nav')
  const c = await getTranslations('common')
  return (
    <header className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-8">
      <Link href="/design/a" aria-label={c('homeLabel')} className="inline-flex min-h-11 items-center gap-3 rounded-md">
        <DoorSymbol className="h-10 w-auto" />
        <span className="font-display text-2xl font-bold">{c('brand')}</span>
      </Link>
      <nav aria-label={t('main')} className="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
        <Link href="/design/a#projects" className="a-btn-quiet">{t('projects')}</Link>
        <Link href="/design/a#training" className="a-btn-quiet">{t('training')}</Link>
        <Link href="/design/a#partners" className="a-btn-quiet">{t('partners')}</Link>
      </nav>
      <div className="ms-auto flex items-center gap-1">
        <LanguageSwitch />
        {signedIn ? (
          <Link href="/design/a/me" className="a-btn-quiet">{t('myPage')}</Link>
        ) : (
          <>
            <Link href="/design/a/me" className="a-btn-quiet hidden sm:inline-flex">{t('signIn')}</Link>
            <Link href="/design/a/me" className="a-btn">{t('join')}</Link>
          </>
        )}
      </div>
    </header>
  )
}

export async function SampleNote() {
  const t = await getTranslations('design')
  return <p className="text-sm text-ink-soft">{t('sample')}</p>
}
