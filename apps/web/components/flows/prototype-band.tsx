import { getTranslations } from 'next-intl/server'

/** The band that marks a screen as a prototype: everything works, nothing is saved. */
export async function PrototypeBand() {
  const t = await getTranslations('app')
  return <p className="bg-maroon-tint px-4 py-2 text-center text-sm font-medium text-maroon">{t('prototype')}</p>
}
