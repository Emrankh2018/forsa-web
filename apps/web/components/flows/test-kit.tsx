'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { TextArea } from '@/components/ui/field'

type Task = { id: string; text: string; href: string }

/**
 * The user-testing kit: guided tasks, an ease scale and a note after each one, two questions at the
 * end and a button that copies everything as plain text. Nothing is sent. Answers are kept in this
 * tab's session storage so a reload does not lose them; if the browser refuses the clipboard, the
 * text is shown in a box to copy by hand.
 */
const storageKey = 'forsa.testkit'

export function TestKit({ groups }: { groups: Array<{ title: string; tasks: Task[] }> }) {
  const t = useTranslations('testKit')
  const scale = t('easyScale').split('|')
  const [easy, setEasy] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [manual, setManual] = useState<string | null>(null)
  const manualRef = useRef<HTMLTextAreaElement>(null)
  const restored = useRef(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null') as { easy?: Record<string, number>; notes?: Record<string, string> } | null
      /* eslint-disable react-hooks/set-state-in-effect -- read once from session storage after hydration */
      if (saved?.easy) setEasy(saved.easy)
      if (saved?.notes) setNotes(saved.notes)
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // storage blocked or unreadable: start empty
    }
    restored.current = true
  }, [])

  useEffect(() => {
    if (!restored.current) return
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ easy, notes }))
    } catch {
      // storage blocked: answers live only on the page
    }
  }, [easy, notes])

  useEffect(() => {
    if (manual !== null) manualRef.current?.select()
  }, [manual])

  function summary() {
    const lines: string[] = []
    for (const g of groups) {
      lines.push(g.title, '')
      for (const task of g.tasks) {
        lines.push(task.text)
        lines.push(`${t('easy')} ${easy[task.id] ? scale[easy[task.id]! - 1] : '-'}`)
        if (notes[task.id]?.trim()) lines.push(`${t('stuck')} ${notes[task.id]!.trim()}`)
        lines.push('')
      }
    }
    lines.push(t('overallTitle'), '')
    for (const k of ['overall1', 'overall2'] as const) lines.push(t(k), notes[k]?.trim() || '-', '')
    return lines.join('\n')
  }

  async function copy() {
    const text = summary()
    try {
      if (!navigator.clipboard) throw new Error('no clipboard')
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setManual(null)
    } catch {
      setCopied(false)
      setManual(text)
    }
  }

  const note = (k: string) => ({ value: notes[k] ?? '', onChange: (e: { target: { value: string } }) => setNotes((n) => ({ ...n, [k]: e.target.value })) })

  return (
    <div className="space-y-14">
      {groups.map((g) => (
        <section key={g.title} aria-labelledby={`group-${g.tasks[0]?.id}`}>
          <h2 id={`group-${g.tasks[0]?.id}`} className="font-display text-2xl font-bold sm:text-3xl">{g.title}</h2>
          <ol className="mt-6 space-y-8" role="list">
            {g.tasks.map((task) => (
              <li key={task.id} className="panel p-5 sm:p-6">
                <h3 id={`task-${task.id}`} className="text-lg font-bold">{task.text}</h3>
                <Link href={task.href} target="_blank" rel="noopener" className="btn-arch mt-4">
                  {t('start')}
                  <span className="sr-only"> {t('newTab')}</span>
                </Link>
                <fieldset className="mt-6">
                  <legend className="font-medium">{t('easy')}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scale.map((label, i) => (
                      <label key={label} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-maroon">
                        <input type="radio" name={`easy-${task.id}`} value={i + 1} checked={easy[task.id] === i + 1} onChange={() => setEasy((e) => ({ ...e, [task.id]: i + 1 }))} className="sr-only" />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-6">
                  <TextArea id={`stuck-${task.id}`} label={t('stuck')} rows={3} {...note(task.id)} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section aria-labelledby="overall">
        <h2 id="overall" className="font-display text-2xl font-bold sm:text-3xl">{t('overallTitle')}</h2>
        <div className="mt-6 space-y-6">
          <TextArea id="overall1" label={t('overall1')} rows={3} {...note('overall1')} />
          <TextArea id="overall2" label={t('overall2')} rows={3} {...note('overall2')} />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button type="button" className="btn-arch" onClick={copy}>{t('copy')}</button>
          <p role="status" className="text-sm font-medium text-maroon">{copied ? t('copied') : ''}</p>
        </div>
        {manual !== null ? (
          <div className="mt-6">
            <p className="font-medium text-maroon" role="alert">{t('copyFailed')}</p>
            <label htmlFor="testkit-manual" className="mt-3 block text-sm font-medium">{t('manualLabel')}</label>
            <textarea id="testkit-manual" ref={manualRef} readOnly value={manual} rows={10} className="mt-2 w-full rounded-lg border border-line bg-paper p-3 text-sm" />
          </div>
        ) : null}
        <p className="mt-3 text-sm text-ink-soft">{t('note')}</p>
      </section>
    </div>
  )
}
