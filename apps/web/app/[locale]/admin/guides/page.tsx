import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { GuideEditor } from '@/components/more/forms'
import { listGuides } from '@/lib/data'

export default async function AdminGuides({ params }: PageProps<'/[locale]/admin/guides'>) {
  const guides = await listGuides()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminGuides')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <GuideEditor
          locale={locale}
          guides={guides.map((g) => ({ slug: g.slug, titleAr: g.title.ar, titleEn: g.title.en, summaryAr: g.summary.ar, summaryEn: g.summary.en, minutes: t('minutes', { n: f.num(g.minutes) }) }))}
        />
      </div>
    </>
  )
}
