'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import { SuccessState, EmptyState } from '@/components/ui/states'
import { TextArea, TextField } from '@/components/ui/field'
import { handInSchema, questionSchema, updateSchema } from '@forsa/shared'
import { useFormCheck } from '@/lib/use-form-check'

type Props = {
  brief: string[]
  deliverables: string[]
  steps: string[]
  stepsDone: number
  updates: Array<{ date: string; text: string; files: number }>
  questions: Array<{ date: string; q: string; a: string | null }>
  stepNumbers: string[]
  /** Pre-formatted "n files" text per update, in the page language. */
  fileCounts: string[]
}

const tabs = ['brief', 'steps', 'updates', 'questions', 'handIn', 'review'] as const
type Tab = (typeof tabs)[number]

/**
 * The project workspace (prototype). Everything responds as it will, but state lives only in this
 * page: ticking steps, posting updates, asking and handing in are not saved anywhere.
 */
export function Workspace(props: Props) {
  const t = useTranslations('workspace')
  const app = useTranslations('app')
  const base = useId()
  const [tab, setTab] = useState<Tab>('steps')
  const [done, setDone] = useState(props.stepsDone)
  const [updates, setUpdates] = useState(props.updates.map((u, i) => ({ ...u, filesText: props.fileCounts[i] ?? '' })))
  const [questions, setQuestions] = useState(props.questions)
  const [handedIn, setHandedIn] = useState(false)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const { errors, check } = useFormCheck()

  const onKey = (e: KeyboardEvent, i: number) => {
    const rtl = document.documentElement.dir === 'rtl'
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft'
    let j = -1
    if (e.key === nextKey) j = (i + 1) % tabs.length
    if (e.key === prevKey) j = (i - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') j = 0
    if (e.key === 'End') j = tabs.length - 1
    if (j >= 0) {
      e.preventDefault()
      setTab(tabs[j]!)
      refs.current[j]?.focus()
    }
  }

  return (
    <div>
      <div role="tablist" aria-label={app('sections')} className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((k, i) => (
          <button
            key={k}
            ref={(el) => { refs.current[i] = el }}
            role="tab"
            id={`${base}-tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`${base}-panel-${k}`}
            tabIndex={tab === k ? 0 : -1}
            onClick={() => setTab(k)}
            onKeyDown={(e) => onKey(e, i)}
            className={`door-tab ${tab === k ? 'door-tab--on' : ''}`}
          >
            {t(`tabs.${k}`)}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${base}-panel-${tab}`} aria-labelledby={`${base}-tab-${tab}`} tabIndex={0} className="max-w-3xl py-8 outline-none">
        {tab === 'brief' ? (
          <div className="space-y-4 text-lg leading-relaxed">
            {props.brief.map((p, i) => <p key={i}>{p}</p>)}
            <ul className="mt-6 space-y-2" role="list">
              {props.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="arch mt-2 inline-block h-4 w-3 flex-none bg-maroon" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'steps' ? (
          <>
            <p className="text-ink-soft">{t('stepsLead')}</p>
            <ol className="mt-6 divide-y divide-line border-y border-line" role="list">
              {props.steps.map((s, i) => {
                const isDone = i < done
                const isNext = i === done
                return (
                  <li key={i} className={`flex items-center gap-4 py-3 ${isNext ? 'font-bold' : ''}`}>
                    <span className={`arch flex h-12 w-9 flex-none items-end justify-center pb-1 font-display text-lg font-bold ${isDone ? 'bg-maroon text-on-night' : 'bg-paper-deep'}`} aria-hidden="true">
                      {props.stepNumbers[i]}
                    </span>
                    <span className={`flex-1 ${isDone ? 'text-ink-soft line-through decoration-line' : ''}`}>{s}</span>
                    {isNext ? (
                      <button type="button" className="btn-arch btn-arch--compact" onClick={() => setDone(done + 1)}>{t('markDone')}</button>
                    ) : null}
                    {isDone && i === done - 1 ? (
                      <button type="button" className="btn-quiet underline underline-offset-4" onClick={() => setDone(done - 1)}>{t('undo')}</button>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </>
        ) : null}

        {tab === 'updates' ? (
          <>
            <p className="text-ink-soft">{t('updatesLead')}</p>
            <form noValidate
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                const text = new FormData(e.currentTarget).get('update')
                if (typeof text === 'string' && check(updateSchema, { update: text })) {
                  setUpdates([...updates, { date: '', text: text.trim(), files: 0, filesText: '' }])
                  e.currentTarget.reset()
                }
              }}
            >
              <TextArea id="update" label={t('updateLabel')} placeholder={t('updatePlaceholder')} rows={3} error={errors.update} />
              <button type="submit" className="btn-arch">{t('post')}</button>
            </form>
            <ul className="mt-8 divide-y divide-line border-y border-line" role="list">
              {[...updates].reverse().map((u, i) => (
                <li key={i} className="py-4">
                  <p>{u.text}</p>
                  <p className="mt-1 text-sm text-ink-soft">{u.date}{u.filesText ? ` ${u.filesText}` : ''}</p>
                  {!u.date ? <p className="mt-1 text-sm text-maroon">{app('savedLocally')}</p> : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {tab === 'questions' ? (
          <>
            <p className="text-ink-soft">{t('questionsLead')}</p>
            <ul className="mt-6 space-y-5" role="list">
              {questions.map((q, i) => (
                <li key={i} className="border-s-2 border-line ps-4">
                  <p className="font-medium">{q.q}</p>
                  {q.a ? <p className="mt-2 border-s-4 border-maroon ps-3">{q.a}</p> : <p className="mt-2 text-sm text-ink-soft">{t('unanswered')}</p>}
                </li>
              ))}
            </ul>
            <form noValidate
              className="mt-8 space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                const text = new FormData(e.currentTarget).get('question')
                if (typeof text === 'string' && check(questionSchema, { question: text })) {
                  setQuestions([...questions, { date: '', q: text.trim(), a: null }])
                  e.currentTarget.reset()
                }
              }}
            >
              <TextField id="question" label={t('askLabel')} error={errors.question} />
              <button type="submit" className="btn-arch">{t('ask')}</button>
            </form>
          </>
        ) : null}

        {tab === 'handIn' ? (
          handedIn ? (
            <>
              <SuccessState title={t('submittedTitle')} body={t('submittedBody')} />
              <p className="mt-3 text-sm text-maroon">{app('savedLocally')}</p>
            </>
          ) : (
            <form
              noValidate
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                if (check(handInSchema, { text: fd.get('handin-text') ?? '', links: fd.get('handin-links') ?? '' })) setHandedIn(true)
              }}
            >
              <p className="text-ink-soft">{t('handInLead')}</p>
              <TextArea id="handin-text" label={t('handInText')} rows={5} error={errors.text} />
              <TextField id="handin-links" type="url" label={t('handInLinks')} placeholder="https://" error={errors.links} />
              <div>
                <label htmlFor="handin-files" className="block font-medium">{t('handInFiles')}</label>
                <p id="handin-files-hint" className="mt-1 text-sm text-ink-soft">{t('handInFilesHint')}</p>
                <input id="handin-files" type="file" multiple aria-describedby="handin-files-hint" className="mt-2 block w-full text-sm file:me-4 file:min-h-11 file:rounded-md file:border-0 file:bg-ink file:px-4 file:text-paper" />
              </div>
              <button type="submit" className="btn-arch">{t('submit')}</button>
            </form>
          )
        ) : null}

        {tab === 'review' ? <EmptyState title={t('reviewEmpty')} body={t('reviewEmptyBody')} /> : null}
      </div>
    </div>
  )
}
