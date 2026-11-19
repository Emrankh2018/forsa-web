import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields } from '@forsa/shared/seed'
import { sampleSkills } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { ContentEditor } from '@/components/more/content-editor'

export default async function AdminContent({ params }: PageProps<'/[locale]/admin/content'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminLists.content')
  const f = formatters(locale)
  const keys = Object.keys(fields) as Array<keyof typeof fields>
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <ContentEditor groups={keys.map((k) => ({ key: k, label: f.pick(fields[k]), skills: sampleSkills[k].map(f.pick) }))} />
      </div>
    </>
  )
}
