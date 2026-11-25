'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { EmptyState, Tag } from '@/components/ui/states'

export type ListRow = {
  id: string
  /** Cells in column order before the state and actions. The first cell is the row's name. */
  cells: string[]
  filter: string
  state: string
  attention?: boolean
  actions?: Array<{ label: string; done: string; nextFilter: string }>
}

/**
 * One list for every admin table: search across the row, filter by state, a state tag, and the
 * decisions an admin can try on a row. Changes are local to this prototype screen.
 */
export function AdminList({ label, columns, rows, filters, counts }: { label: string; columns: string[]; rows: ListRow[]; filters: Array<{ value: string; label: string }>; counts: string[] }) {
  const t = useTranslations('adminLists')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const status = useRef<HTMLParagraphElement>(null)
  const labels = new Map(filters.map(({ value, label }) => [value, label]))
  const needle = q.trim().toLowerCase()
  const shown = rows.filter((r) => (filter === 'all' || (changes[r.id] ?? r.filter) === filter) && (!needle || r.cells.join(' ').toLowerCase().includes(needle)))
  const searchId = `${label}-q`.replace(/\s+/g, '-')
  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end gap-4">
        <div className="field min-w-56 flex-1">
          <label htmlFor={searchId} className="block font-medium">{t('search')}</label>
          <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-2 block min-h-12 w-full rounded-md border border-line bg-paper px-3 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon" />
        </div>
        <div role="group" aria-label={t('filter')} className="flex flex-wrap gap-2">
          {[{ value: 'all', label: t('all') }, ...filters].map((f) => (
            <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)} className={`min-h-11 rounded-full border px-4 text-sm ${filter === f.value ? 'border-ink bg-ink text-paper' : 'border-line'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">{counts[shown.length]}</p>
      <p ref={status} role="status" tabIndex={-1} className={message ? 'mt-3 text-sm font-medium' : 'sr-only'}>{message}</p>
      {shown.length === 0 ? (
        <div className="mt-4"><EmptyState title={t('none')} body={t('noneBody')} /></div>
      ) : (
        <div className="relative mt-4 overflow-x-auto" role="region" aria-label={label} tabIndex={0}>
          <table className="w-full min-w-[44rem]">
            <thead>
              <tr className="border-b border-ink text-sm text-ink-soft">
                {columns.map((c) => <th key={c} scope="col" className="py-2 pe-4 text-start font-medium">{c}</th>)}
                <th scope="col" className="py-2 text-start font-medium"><span className="sr-only">{t('filter')}</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pe-4 text-start font-medium">{r.cells[0]}</th>
                  {r.cells.slice(1).map((c, i) => <td key={i} className="py-3 pe-4">{c}</td>)}
                  <td className="py-3 pe-4"><Tag tone={r.attention && !changes[r.id] ? 'accent' : 'plain'}>{labels.get(changes[r.id] ?? r.filter) ?? r.state}</Tag></td>
                  <td className="py-3">
                    {!changes[r.id] ? (
                      <span className="flex flex-wrap gap-2">
                        {r.actions?.map((a) => (
                          <button key={a.label} type="button" className="min-h-11 rounded-full border border-ink px-4 text-sm" onClick={() => {
                            setChanges((current) => ({ ...current, [r.id]: a.nextFilter }))
                            setMessage(a.done)
                            requestAnimationFrame(() => status.current?.focus())
                          }}>
                            {a.label}
                          </button>
                        ))}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
