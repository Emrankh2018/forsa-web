'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tag } from '@/components/ui/states'

/** Attendance for one workshop: confirmed attendees are marked attended or missed. */
export function Attendance({ people }: { people: Array<{ name: string; state: 'confirmed' | 'reserved' }> }) {
  const t = useTranslations('trainerArea')
  const app = useTranslations('app')
  const [marks, setMarks] = useState<Record<number, 'attended' | 'missed'>>({})
  return (
    <>
      <ul className="divide-y divide-line border-y border-line" role="list">
        {people.map((p, i) => (
          <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
            <span className="flex-1 font-medium">{p.name}</span>
            {p.state === 'reserved' ? (
              <Tag>{app('state.reserved')}</Tag>
            ) : (
              <span className="flex gap-2" role="group" aria-label={`${t('markAttendance')}: ${p.name}`}>
                {(['attended', 'missed'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={marks[i] === m}
                    onClick={() => setMarks({ ...marks, [i]: m })}
                    className={`min-h-11 rounded-md border px-3 text-sm ${marks[i] === m ? 'border-ink bg-ink text-paper' : 'border-line'}`}
                  >
                    {t(m)}
                  </button>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
      {Object.keys(marks).length ? <p className="mt-3 text-sm text-maroon" role="status">{app('savedLocally')}</p> : null}
    </>
  )
}

/** The week's open hours. Press an hour to open or close it; booked hours cannot be closed. */
export function AvailabilityGrid({
  days, hours, hourLabels, initial, booked,
}: {
  days: string[]
  hours: number[]
  hourLabels: string[]
  initial: Array<{ day: number; hour: number }>
  booked: Array<{ day: number; hour: number; label: string }>
}) {
  const t = useTranslations('trainerArea')
  const [open, setOpen] = useState(new Set(initial.map((s) => `${s.day}-${s.hour}`)))
  return (
    <div className="relative overflow-x-auto" role="region" aria-label={t('availabilityTitle')} tabIndex={0}>
      <table className="w-full min-w-[40rem] border-collapse">
        <thead>
          <tr>
            <td />
            {days.map((d) => (
              <th key={d} scope="col" className="py-2 text-sm font-medium">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((h, hi) => (
            <tr key={h}>
              <th scope="row" className="py-1 pe-3 text-end text-sm font-normal text-ink-soft">{hourLabels[hi]}</th>
              {days.map((d, di) => {
                const key = `${di}-${h}`
                const b = booked.find((x) => x.day === di && x.hour === h)
                const on = open.has(key) || Boolean(b)
                return (
                  <td key={key} className="p-1">
                    <button
                      type="button"
                      disabled={Boolean(b)}
                      aria-pressed={on}
                      aria-label={`${d} ${hourLabels[hi]}: ${b ? b.label : on ? t('openSlot') : t('closedSlot')}`}
                      onClick={() => {
                        const n = new Set(open)
                        if (n.has(key)) n.delete(key)
                        else n.add(key)
                        setOpen(n)
                      }}
                      className={`flex h-12 w-full items-end justify-center rounded-t-[999px] pb-1 text-xs ${b ? 'bg-maroon text-on-night' : on ? 'bg-ink text-paper' : 'border border-dashed border-line text-ink-soft'}`}
                    >
                      {b ? b.label : on ? t('openSlot') : ''}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Course builder: modules and lessons; add a lesson, mark a free preview. */
export function CourseBuilder({ modules, moduleLabels }: { modules: Array<{ title: string; lessons: Array<{ title: string; preview?: boolean }> }>; moduleLabels: string[] }) {
  const t = useTranslations('trainerArea')
  const app = useTranslations('app')
  const [state, setState] = useState(modules)
  const [touched, setTouched] = useState(false)
  return (
    <div className="space-y-8">
      {state.map((m, mi) => (
        <section key={mi} className="panel p-5" aria-label={moduleLabels[mi]}>
          <p className="text-sm text-ink-soft">{moduleLabels[mi]}</p>
          <h2 className="font-display text-xl font-bold">{m.title}</h2>
          <ul className="mt-3 divide-y divide-line" role="list">
            {m.lessons.map((l, li) => (
              <li key={li} className="flex flex-wrap items-center gap-3 py-2">
                <span className="flex-1">{l.title}</span>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(l.preview)}
                    onChange={() => {
                      setTouched(true)
                      setState(state.map((mm, i) => (i !== mi ? mm : { ...mm, lessons: mm.lessons.map((ll, j) => (j === li ? { ...ll, preview: !ll.preview } : ll)) })))
                    }}
                    className="size-5 accent-maroon"
                  />
                  {t('previewFlag')}
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-quiet -ms-3 mt-2 underline underline-offset-4"
            onClick={() => {
              setTouched(true)
              setState(state.map((mm, i) => (i !== mi ? mm : { ...mm, lessons: [...mm.lessons, { title: t('newLesson') }] })))
            }}
          >
            {t('addLesson')}
          </button>
        </section>
      ))}
      {touched ? <p className="text-sm text-maroon" role="status">{app('savedLocally')}</p> : null}
      <button type="button" className="btn-arch">{t('sendCourse')}</button>
    </div>
  )
}

/** One admin queue item with its actions; acting marks it handled (logged in the real product). */
export function QueueItem({ title, meta, actions }: { title: string; meta: string; actions: string[] }) {
  const app = useTranslations('app')
  const [done, setDone] = useState<string | null>(null)
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-ink-soft">{meta}</p>
      </div>
      {done ? (
        <span className="text-end" role="status">
          <Tag tone="accent">{done}</Tag>
          <span className="block text-xs text-maroon">{app('savedLocally')}</span>
        </span>
      ) : (
        <span className="flex gap-2">
          {actions.map((a, i) => (
            <button key={a} type="button" onClick={() => setDone(a)} className={i === 0 ? 'btn-arch btn-arch--compact' : 'min-h-11 rounded-md border border-line px-3 text-sm'}>
              {a}
            </button>
          ))}
        </span>
      )}
    </li>
  )
}
