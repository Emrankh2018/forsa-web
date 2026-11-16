import { getTranslations } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { fields, seatsLeft, type SampleProject } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Door, seatAngle } from '@/components/site/door'
import { Divider } from '@/components/ui/section-heading'

/** A project as a narrow door standing ajar: the wider the gap, the more seats are left. */
export async function ProjectCard({ project: x, locale, headingLevel = 'h3' }: { project: SampleProject; locale: Locale; headingLevel?: 'h2' | 'h3' }) {
  const p = await getTranslations('project')
  const f = formatters(locale)
  const left = seatsLeft(x)
  const Heading = headingLevel
  return (
    <Link href={`/projects/${x.slug}`} className="room block rounded-md">
      <Door
        open={seatAngle(left, x.seats)}
        className="h-44 w-full sm:h-64 sm:w-[min(100%,15rem)]"
        light={<p className="text-xs font-medium leading-snug sm:text-sm">{p('seatsLeft', { count: left, n: f.num(left) })}</p>}
      />
      <p className="mt-4 text-sm text-ink-soft">{f.pick(x.company)}</p>
      <Heading className="font-display mt-1 text-xl font-bold leading-snug sm:text-2xl">{f.pick(x.title)}</Heading>
      <p className="mt-2 text-sm text-ink-soft">
        <span>{f.pick(fields[x.field])}</span>
        <Divider />
        <span>{x.joinMode === 'open' ? p('modeOpen') : p('modeApply')}</span>
      </p>
      <p className="mt-1 text-sm font-medium">
        {left === 0 ? p('fullCta') : x.applyBy ? p('applyBy', { date: f.day(x.applyBy) }) : p('due', { date: f.day(x.dueAt) })}
      </p>
    </Link>
  )
}
