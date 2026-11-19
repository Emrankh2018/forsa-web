import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { NewProjectWizard } from '@/components/app/new-project-wizard'
import { fields } from '@/lib/data'

export default async function NewProject({ params }: PageProps<'/[locale]/org/new-project'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('org')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('wizardTitle')}</h1>
      <div className="mt-10">
        <NewProjectWizard
          fields={Object.entries(fields).map(([value, label]) => ({ value, label: f.pick(label) }))}
          stepNumbers={[1, 2, 3, 4].map(f.num)}
          stepOf={[1, 2, 3, 4].map((n) => t('stepOf', { n: f.num(n), total: f.num(4) }))}
        />
      </div>
    </>
  )
}
