import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'
import { NavLinks } from '@/components/site/nav-links'

/**
 * The site header. Desktop: logo, navigation, actions on one line. Phone: logo and actions on the
 * first line, the navigation on a second line you can swipe. One navigation landmark either way.
 */
export async function SiteHeader() {
  const t = await getTranslations('nav')
  const c = await getTranslations('common')
  return (
    <header className="site-header mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-6 px-4 pt-3 sm:px-8 md:grid-cols-[auto_auto_1fr] md:py-4">
      <Link href="/" aria-label={c('homeLabel')} className="inline-flex min-h-11 items-center gap-2.5 rounded-md">
        <DoorSymbol className="h-9 w-auto md:h-10" />
        <span className="font-display text-2xl font-bold">{c('brand')}</span>
      </Link>
      <nav
        aria-label={t('main')}
        className="col-span-2 row-start-2 -mx-4 mt-2 flex gap-1 overflow-x-auto border-t border-line px-1 sm:-mx-8 sm:px-5 md:col-span-1 md:col-start-2 md:row-start-1 md:mx-0 md:mt-0 md:border-0 md:px-0"
      >
        <NavLinks
          links={[
            { href: '/projects', label: t('projects') },
            { href: '/learn', label: t('learn'), also: ['/workshops', '/sessions', '/courses', '/guides'] },
            { href: '/partners', label: t('partners'), also: ['/trainers'] },
          ]}
          extra={{ href: '/sign-in', label: t('signIn') }}
        />
      </nav>
      <div className="col-start-2 row-start-1 flex items-center justify-end gap-1 md:col-start-3">
        <LanguageSwitch />
        <Link href="/sign-in" className="btn-quiet hidden sm:inline-flex">{t('signIn')}</Link>
        <Link href="/join" className="btn-arch btn-arch--compact">
          <span className="sm:hidden">{t('joinShort')}</span>
          <span className="hidden sm:inline">{t('join')}</span>
        </Link>
      </div>
    </header>
  )
}
