'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { EmptyState } from '@/components/ui/states'

type Notice = { id: string; text: string; when: string; href: string; unread: boolean }

/** The notices centre: everything that happened to you, unread first-class, all in one place. */
export function NoticesList({ notices }: { notices: Notice[] }) {
  const t = useTranslations('noticesPage')
  const [items, setItems] = useState(notices)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const shown = filter === 'all' ? items : items.filter((n) => n.unread)
  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label={t('title')} className="flex gap-2">
          {(['all', 'unread'] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={filter === k}
              onClick={() => setFilter(k)}
              className={`min-h-11 rounded-full border px-4 text-sm ${filter === k ? 'border-ink bg-ink text-paper' : 'border-line'}`}
            >
              {t(k)}
            </button>
          ))}
        </div>
        <button type="button" className="btn-quiet ms-auto underline underline-offset-4" onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}>
          {t('markAll')}
        </button>
      </div>
      {shown.length === 0 ? (
        <div className="mt-6"><EmptyState title={t('empty')} body={t('emptyBody')} /></div>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line" role="list">
          {shown.map((n) => (
            <li key={n.id} className="flex items-start gap-3 py-4">
              <span className={`arch mt-1 inline-block h-5 w-3.5 flex-none ${n.unread ? 'bg-maroon' : 'bg-paper-deep'}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <Link
                  href={n.href}
                  onClick={() => setItems(items.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                  className={`underline-offset-4 hover:underline ${n.unread ? 'font-bold' : ''}`}
                >
                  {n.text}
                </Link>
                <p className="mt-1 text-sm text-ink-soft">{n.when}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
