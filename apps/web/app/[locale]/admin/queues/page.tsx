import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleQueues } from '@forsa/shared/seed/app'
import { formatters } from '@/lib/format'
import { SectionHeading } from '@/components/ui/section-heading'
import { QueueItem } from '@/components/app/trainer-widgets'

/** Every queue on one page, each item with the decisions an admin can take. */
export default async function AdminQueues({ params }: PageProps<'/[locale]/admin/queues'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('adminArea')
  const pt = await getTranslations('partners')
  const f = formatters(locale)
  const q = sampleQueues
  const block = (id: string, title: string, items: Array<{ title: string; meta: string }>, actions: string[]) => (
    <section key={id} id={id} className="scroll-mt-6" aria-labelledby={`${id}-h`}>
      <SectionHeading id={`${id}-h`}>{title}</SectionHeading>
      <ul className="mt-4 divide-y divide-line border-y border-line" role="list">
        {items.map((it, i) => <QueueItem key={i} title={it.title} meta={it.meta} actions={actions} />)}
      </ul>
    </section>
  )
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('nav.queues')}</h1>
      <div className="mt-10 max-w-4xl space-y-14">
        {block('organisations', t('organisations'), q.organisations.map((o) => ({ title: f.pick(o.name), meta: `${f.pick(o.sector)} ${f.day(o.at)}` })), [t('verify'), t('reject')])}
        {block('projects', t('projects'), q.projects.map((p) => ({ title: f.pick(p.title), meta: `${f.pick(p.org)} ${f.day(p.at)}` })), [t('approve'), t('reject')])}
        {block('trainers', t('trainers'), q.trainers.map((p) => ({ title: f.pick(p.name), meta: `${f.pick(p.expertise)} ${f.day(p.at)}` })), [t('approve'), t('reject')])}
        {block('training', t('training'), q.training.map((p) => ({ title: f.pick(p.title), meta: `${f.pick(p.trainer)} ${f.day(p.at)}` })), [t('publish'), t('reject')])}
        {block('bookings', t('bookings'), q.bookings.map((b) => ({ title: `${f.pick(b.name)}: ${f.pick(b.item)}`, meta: `${f.money(b.dirhams)} ${f.day(b.at)}` })), [t('markPaid'), t('waive')])}
        {block('leads', t('leads'), q.leads.map((l) => ({ title: f.pick(l.org), meta: `${new Intl.ListFormat(locale).format(l.ways.map((w) => pt(w as 'post_project')))} ${f.day(l.at)}` })), [t('contact'), t('done')])}
      </div>
    </>
  )
}
