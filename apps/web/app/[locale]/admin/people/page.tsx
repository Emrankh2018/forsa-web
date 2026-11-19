import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { samplePeople } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { PeopleTable } from '@/components/more/tables'

export default async function AdminPeople({ params }: PageProps<'/[locale]/admin/people'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminPeople')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <PeopleTable
          people={samplePeople.map((p) => ({ id: p.id, name: f.pick(p.name), kind: p.kind, joined: f.day(p.joined), state: p.state }))}
          counts={Array.from({ length: samplePeople.length + 1 }, (_, n) => t('count', { n: f.num(n) }))}
        />
      </div>
    </>
  )
}
