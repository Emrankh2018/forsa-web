'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tag } from '@/components/ui/states'

type Person = { id: string; name: string; project: string; state: 'accepted' | 'shortlisted' | 'sent'; email?: string }

/** The company's shortlist. Contact details appear only for people who accepted the invitation. */
export function TalentList({ people }: { people: Person[] }) {
  const t = useTranslations('org')
  const app = useTranslations('app')
  const [states, setStates] = useState<Record<string, Person['state']>>(Object.fromEntries(people.map((p) => [p.id, p.state])))
  const [touched, setTouched] = useState(false)
  return (
    <>
      <ul className="divide-y divide-line border-y border-line" role="list">
        {people.map((p) => {
          const state = states[p.id]!
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-bold">{p.name}</p>
                <p className="text-sm text-ink-soft">{p.project}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-end">
                <Tag tone={state === 'accepted' ? 'accent' : 'plain'}>{app(`state.${state}`)}</Tag>
                {state === 'accepted' && p.email ? (
                  <span className="text-sm">{t('contactReleased')} <span dir="ltr">{p.email}</span></span>
                ) : (
                  <span className="text-sm text-ink-soft">{t('contactHidden')}</span>
                )}
                {state === 'shortlisted' ? (
                  <button
                    type="button"
                    className="btn-arch btn-arch--compact mt-1"
                    onClick={() => {
                      setStates((s) => ({ ...s, [p.id]: 'sent' }))
                      setTouched(true)
                    }}
                  >
                    {t('invite')}
                  </button>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
      {touched ? <p className="mt-4 text-sm text-maroon" role="status">{app('savedLocally')}</p> : null}
    </>
  )
}
