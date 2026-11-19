'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { EmptyState, Tag } from '@/components/ui/states'

type Person = { id: string; name: string; kind: 'participant' | 'organisation' | 'trainer'; joined: string; state: 'active' | 'pending' | 'suspended' }

/** Everyone with an account, with a name search and a filter by kind of account. */
export function PeopleTable({ people, counts }: { people: Person[]; counts: string[] }) {
  const t = useTranslations('adminPeople')
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<'all' | Person['kind']>('all')
  const shown = people.filter((p) => (kind === 'all' || p.kind === kind) && p.name.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end gap-4">
        <div className="field min-w-56 flex-1">
          <label htmlFor="people-q" className="block font-medium">{t('search')}</label>
          <input id="people-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-2 block min-h-12 w-full rounded-md border border-line bg-paper px-3 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon" />
        </div>
        <div role="group" aria-label={t('filter')} className="flex flex-wrap gap-2">
          {(['all', 'participant', 'organisation', 'trainer'] as const).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`min-h-11 rounded-full border px-4 text-sm ${kind === k ? 'border-ink bg-ink text-paper' : 'border-line'}`}>
              {t(`kinds.${k}`)}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">{counts[shown.length]}</p>
      {shown.length === 0 ? (
        <div className="mt-4"><EmptyState title={t('none')} body={t('noneBody')} /></div>
      ) : (
        <div className="relative mt-4 overflow-x-auto" role="region" aria-label={t('title')} tabIndex={0}>
          <table className="w-full min-w-[36rem] text-start">
            <thead>
              <tr className="border-b border-ink text-sm text-ink-soft">
                <th scope="col" className="py-2 text-start font-medium">{t('name')}</th>
                <th scope="col" className="py-2 text-start font-medium">{t('kind')}</th>
                <th scope="col" className="py-2 text-start font-medium">{t('joined')}</th>
                <th scope="col" className="py-2 text-start font-medium">{t('state')}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <th scope="row" className="py-3 text-start font-medium">{p.name}</th>
                  <td className="py-3">{t(`kinds.${p.kind}`)}</td>
                  <td className="py-3">{p.joined}</td>
                  <td className="py-3"><Tag tone={p.state === 'active' ? 'plain' : 'accent'}>{t(`states.${p.state}`)}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

type Row = { at: string; when: string; who: string; action: string }

/** The audit log with a CSV download made in the browser (UTF-8 with a byte-order mark for Excel). */
export function AuditTable({ rows, fileName }: { rows: Row[]; fileName: string }) {
  const t = useTranslations('adminAudit')
  function download() {
    const cell = (v: string) => `"${v.replace(/"/g, '""')}"`
    const csv = [[t('when'), t('who'), t('action')], ...rows.map((r) => [r.at, r.who, r.action])].map((r) => r.map(cell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="btn-arch" onClick={download}>{t('export')}</button>
        <p className="text-sm text-ink-soft">{t('exportNote')}</p>
      </div>
      <div className="relative mt-6 overflow-x-auto" role="region" aria-label={t('title')} tabIndex={0}>
        <table className="w-full min-w-[36rem]">
          <thead>
            <tr className="border-b border-ink text-sm text-ink-soft">
              <th scope="col" className="py-2 text-start font-medium">{t('when')}</th>
              <th scope="col" className="py-2 text-start font-medium">{t('who')}</th>
              <th scope="col" className="py-2 text-start font-medium">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.at} className="border-b border-line">
                <td className="py-3 pe-4 whitespace-nowrap"><time dateTime={r.at}>{r.when}</time></td>
                <td className="py-3 pe-4">{r.who}</td>
                <td className="py-3">{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
