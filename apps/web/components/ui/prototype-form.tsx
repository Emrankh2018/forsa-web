'use client'

import { useSyncExternalStore, type ComponentPropsWithoutRef } from 'react'
import { useTranslations } from 'next-intl'

const subscribe = () => () => {}

/** Client-only forms keep their controls inactive until React can handle submission. */
export function PrototypeForm(props: Omit<ComponentPropsWithoutRef<'form'>, 'action' | 'method' | 'inert'>) {
  const t = useTranslations('forms')
  const ready = useSyncExternalStore(subscribe, () => true, () => false)
  return (
    <>
      <noscript><p className="mt-4 text-sm text-ink-soft">{t('requiresScript')}</p></noscript>
      <form {...props} inert={!ready} method="post" />
    </>
  )
}
