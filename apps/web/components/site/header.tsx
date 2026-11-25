import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'
import { SmoothScroll } from '@/components/motion/smooth-scroll'

/**
 * The site header has no menu: the doors are the way into each area (the hall on the home page,
 * the door row at the end of every other page). It holds the logo, the language, and "Come in":
 * an arch with a small door that swings open when you point at it or focus it.
 */
export async function SiteHeader({ query, languageHash }: { query?: Record<string, string | undefined>; languageHash?: string }) {
  const t = await getTranslations('nav')
  const c = await getTranslations('common')
  return (
    <header className="site-header mx-auto flex max-w-7xl items-center gap-x-4 px-4 py-3 sm:px-8 md:py-4">
      <SmoothScroll />
      <Link href="/" aria-label={c('homeLabel')} className="inline-flex min-h-11 items-center gap-2.5 rounded-md">
        <DoorSymbol className="h-9 w-auto md:h-10" />
        <span className="font-display text-2xl font-bold">{c('brand')}</span>
      </Link>
      <div className="ms-auto flex items-center gap-2">
        <LanguageSwitch query={query} hash={languageHash} />
        <Link href="/join" aria-label={t('enterLabel')} className="come-in">
          <span className="come-in__door" aria-hidden="true">
            <span className="come-in__leaf" />
          </span>
          <span>{t('enter')}</span>
        </Link>
      </div>
    </header>
  )
}
