'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { EmptyState, Tag } from '@/components/ui/states'

export type ListRow = {
  id: string
  /** Cells in column order; the first is the row's name. The last column is the state tag. */
  cells: string[]
  filter: string
  state: string
  attention?: boolean
  actions?: Array<{ label: string; done: string }>
}

/**
 * One list for every admin table: search across the row, filter by state, a state tag, and the
 * decisions an admin can take on a row (the prototype only says what would happen).
 */
export function AdminList({ label, columns, rows, filters, counts }: { label: string; columns: string[]; rows: ListRow[]; filters: Array<{ value: string; label: string }>; counts: string[] }) {
  const t = useTranslations('adminLists')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [done, setDone] = useState<Record<string, string>>({})
  const needle = q.trim().toLowerCase()
  const shown = rows.filter((r) => (filter === 'all' || r.filter === filter) && (!needle || r.cells.join(' ').toLowerCase().includes(needle)))
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
                  <td className="py-3 pe-4"><Tag tone={r.attention ? 'accent' : 'plain'}>{r.state}</Tag></td>
                  <td className="py-3">
                    {done[r.id] ? (
                      <p role="status" className="max-w-56 text-sm font-medium">{done[r.id]}</p>
                    ) : (
                      <span className="flex flex-wrap gap-2">
                        {r.actions?.map((a) => (
                          <button key={a.label} type="button" className="min-h-11 rounded-full border border-ink px-4 text-sm" onClick={() => setDone((d) => ({ ...d, [r.id]: a.done }))}>
                            {a.label}
                          </button>
                        ))}
                      </span>
                    )}
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
