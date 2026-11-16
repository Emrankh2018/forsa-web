import { getTranslations } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import type { SampleWorkshop } from '@forsa/shared/seed'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { Divider } from '@/components/ui/section-heading'

/** One workshop in the corridor: its day in a small arch, title and facts, price at the line's end. */
export async function WorkshopRow({ workshop: ws, locale, headingLevel = 'h3' }: { workshop: SampleWorkshop; locale: Locale; headingLevel?: 'h2' | 'h3' }) {
  const w = await getTranslations('workshop')
  const f = formatters(locale)
  const left = ws.capacity - ws.booked
  const Heading = headingLevel
  return (
    <Link href={`/workshops/${ws.slug}`} className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-1 py-6 sm:grid-cols-[6rem_1fr_auto]">
      <span className="row-span-2 sm:row-span-1">
        <span className="arch flex h-24 w-16 flex-col items-center justify-end bg-paper-deep pb-2 sm:w-20">
          <span className="font-display text-3xl font-bold leading-none">{f.dayNum(ws.startsAt)}</span>
        </span>
      </span>
      <div>
        <Heading className="font-display text-2xl font-bold">{f.pick(ws.title)}</Heading>
        <p className="mt-1 text-sm text-ink-soft">
          {f.dayWeekday(ws.startsAt)}
          <Divider />
          {f.time(ws.startsAt)}
          <Divider />
          {ws.online ? w('online') : w('inPerson')}
          <Divider />
          {w('minutes', { count: ws.minutes, n: f.num(ws.minutes) })}
        </p>
      </div>
      <span className="col-start-2 flex items-center gap-4 sm:col-start-3 sm:flex-col sm:items-end sm:gap-1">
        <span className="text-lg font-bold text-maroon">{f.money(ws.priceDirhams)}</span>
        <span className="text-sm text-ink-soft">{w('seatsLeft', { count: left, n: f.num(left) })}</span>
      </span>
    </Link>
  )
}
