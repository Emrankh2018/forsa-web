'use client'

import { useId, useRef } from 'react'
import { Link } from '@/i18n/navigation'

/**
 * A soft gate for actions that need an account (join, apply, book, save): explains why, offers to
 * continue to sign in, and brings the person back to this page afterwards (?next=).
 */
export function SignInPrompt({
  label, returnTo, title, body, continueLabel, notNowLabel, variant = 'primary',
}: {
  label: string
  returnTo: string
  title: string
  body: string
  continueLabel: string
  notNowLabel: string
  variant?: 'primary' | 'quiet' | 'compact'
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  return (
    <>
      <button
        type="button"
        className={variant === 'primary' ? 'btn-arch w-full' : variant === 'compact' ? 'btn-arch btn-arch--compact' : 'btn-quiet -ms-3 underline underline-offset-4'}
        onClick={() => dialog.current?.showModal()}
      >
        {label}
      </button>
      <dialog ref={dialog} className="sheet m-auto" aria-labelledby={titleId} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="sheet__body">
          <h2 id={titleId} className="font-display text-3xl font-bold">{title}</h2>
          <p className="mt-3 leading-relaxed">{body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={{ pathname: '/sign-in', query: { next: returnTo } }} className="btn-arch">{continueLabel}</Link>
            <button type="button" className="btn-quiet" onClick={() => dialog.current?.close()}>{notNowLabel}</button>
          </div>
        </div>
      </dialog>
    </>
  )
}
