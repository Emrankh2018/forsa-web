import { Link } from '@/i18n/navigation'

type Group = { param: string; label: string; current?: string; options: Array<{ value: string; label: string }> }

/**
 * Search box and filter chips for a public list. A plain GET form and links, so it works without
 * scripts and every result has its own address.
 */
export function ListFilters({
  pathname, locale, q, searchLabel, placeholder, groups, resultsText, filtered, labels,
}: {
  pathname: '/workshops' | '/courses' | '/projects'
  locale: string
  q: string
  searchLabel: string
  placeholder: string
  groups: Group[]
  resultsText: string
  filtered: boolean
  labels: { filters: string; all: string; apply: string; reset: string }
}) {
  const chip = 'inline-flex min-h-11 items-center rounded-full border px-4 text-sm'
  const on = `${chip} border-ink bg-ink text-paper`
  const off = `${chip} border-line hover:border-ink`
  const state = Object.fromEntries(groups.map((g) => [g.param, g.current]))
  const href = (next: Record<string, string | undefined>) => ({
    pathname,
    query: Object.fromEntries(Object.entries({ q: q || undefined, ...state, ...next }).filter(([, v]) => v)) as Record<string, string>,
  })
  return (
    <section aria-label={labels.filters} className="mx-auto mt-12 max-w-7xl px-4 sm:px-8">
      <form action={`/${locale}${pathname}`} method="get" role="search" className="flex max-w-2xl flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="q" className="block font-medium">{searchLabel}</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder={placeholder} className="mt-2 block min-h-12 w-full rounded-md border border-line bg-paper px-3 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon" />
        </div>
        {groups.map((g) => (g.current ? <input key={g.param} type="hidden" name={g.param} value={g.current} /> : null))}
        <button type="submit" className="btn-arch">{labels.apply}</button>
      </form>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {groups.map((g) => (
          <div key={g.param} className="flex flex-wrap items-center gap-2" role="group" aria-label={g.label}>
            <span className="me-1 text-sm text-ink-soft">{g.label}</span>
            <Link href={href({ [g.param]: undefined })} className={!g.current ? on : off} aria-current={!g.current ? 'true' : undefined}>{labels.all}</Link>
            {g.options.map((o) => (
              <Link key={o.value} href={href({ [g.param]: o.value })} className={g.current === o.value ? on : off} aria-current={g.current === o.value ? 'true' : undefined}>{o.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink-soft" role="status">
        {resultsText}
        {filtered ? <Link href={pathname} className="btn-quiet ms-2 underline underline-offset-4">{labels.reset}</Link> : null}
      </p>
    </section>
  )
}
