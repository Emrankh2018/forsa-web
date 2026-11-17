import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { DoorSymbol } from '@/components/door-symbol'
import { LanguageSwitch } from '@/components/language-switch'
import { AreaTabs, type AreaTab } from '@/components/app/area-tabs'

/**
 * The frame of a signed-in area (participant, organisation, trainer, admin). These are tools:
 * calm and dense where needed, one motion moment per screen at most. Until the back end exists
 * every area is a prototype with sample data, and the band at the top says so.
 */
export async function AreaShell({ area, tabs, children }: { area: 'participant' | 'org' | 'trainer' | 'admin'; tabs: AreaTab[]; children: ReactNode }) {
  const t = await getTranslations('app')
  const c = await getTranslations('common')
  return (
    <>
      <header className="site-header">
      <p className="bg-maroon-tint px-4 py-2 text-center text-sm font-medium text-maroon">{t('prototype')}</p>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-4 sm:px-8">
        <Link href="/" aria-label={c('homeLabel')} className="inline-flex min-h-11 items-center gap-2.5 rounded-md">
          <DoorSymbol className="h-9 w-auto" />
          <span className="font-display text-2xl font-bold">{c('brand')}</span>
        </Link>
        <span className="h-6 w-px bg-line" aria-hidden="true" />
        <span className="font-medium text-ink-soft">{t(area)}</span>
        <div className="ms-auto flex items-center gap-1">
          <LanguageSwitch />
          <Link href="/" className="btn-quiet underline underline-offset-4">{t('backToSite')}</Link>
        </div>
      </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <AreaTabs label={t('sections')} tabs={tabs} />
      </div>
      <main id="content" tabIndex={-1} className="mx-auto max-w-7xl px-4 pb-24 pt-8 outline-none sm:px-8">
        {children}
      </main>
    </>
  )
}
