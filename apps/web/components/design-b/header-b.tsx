import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'

export async function HeaderB({ signedIn = false }: { signedIn?: boolean }) {
  const t = await getTranslations('design.nav')
  const c = await getTranslations('common')
  return (
    <header className="b-row items-center py-5">
      <div className="b-margin flex items-center md:justify-end">
        <Link href="/design/b" aria-label={c('homeLabel')} className="inline-flex min-h-11 items-center gap-2 rounded-md text-ink">
          <DoorSymbol className="h-8 w-auto" />
          <span className="font-display text-2xl font-bold">{c('brand')}</span>
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <nav aria-label={t('main')} className="b-nav -ms-2 flex flex-wrap">
          <Link href="/design/b#projects" className="b-link">{t('projects')}</Link>
          <Link href="/design/b#training" className="b-link">{t('training')}</Link>
          <Link href="/design/b#partners" className="b-link">{t('partners')}</Link>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitch />
          {signedIn ? (
            <Link href="/design/b/me" className="b-link inline-flex min-h-11 items-center px-2 font-medium">{t('myPage')}</Link>
          ) : (
            <>
              <Link href="/design/b/me" className="b-link hidden min-h-11 items-center px-2 sm:inline-flex">{t('signIn')}</Link>
              <Link href="/design/b/me" className="b-btn">{t('join')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
