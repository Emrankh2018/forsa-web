import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { getQueues } from '@/lib/data'

const queues = ['organisations', 'projects', 'trainers', 'training', 'bookings', 'leads'] as const

/** Admin overview: what is waiting, as counts that lead straight to each queue. */
export default async function AdminHome({ params }: PageProps<'/[locale]/admin'>) {
  const sampleQueues = await getQueues()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminArea')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('nav.home')}</h1>
      <section className="mt-10" aria-labelledby="waiting">
        <SectionHeading id="waiting">{t('waiting')}</SectionHeading>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3" role="list">
          {queues.map((q) => (
            <li key={q}>
              <Link href={`/admin/queues#${q}`} className="panel flex items-end gap-4 p-5 hover:border-ink">
                <span className="arch flex h-16 w-12 flex-none items-end justify-center bg-ink pb-1 font-display text-2xl font-bold text-paper">{f.num(sampleQueues[q].length)}</span>
                <span className="font-medium leading-snug">{t(q)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-10 text-sm text-ink-soft">{t('auditNote')}</p>
    </>
  )
}
