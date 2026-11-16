import type { ReactNode } from 'react'

/**
 * The four states every screen has. Each one says what happened and what to do next, in the
 * interface's voice. Doors keep their meaning: closed when there is nothing yet, open on success.
 */

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 border-y border-line py-10 sm:flex-row sm:items-end sm:gap-8" role="status">
      <div className="arch h-24 w-16 flex-none bg-ink" aria-hidden="true" />
      <div>
        <p className="font-display text-2xl font-bold">{title}</p>
        <p className="mt-2 max-w-xl text-ink-soft">{body}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  )
}

export function ErrorState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="border-s-4 border-maroon bg-maroon-tint px-5 py-4" role="alert">
      <p className="font-medium text-maroon">{title}</p>
      <p className="mt-1 text-ink">{body}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

export function SuccessState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 border-y border-line py-8 sm:flex-row sm:items-end sm:gap-8" role="status">
      <div className="door door--open-mark h-24 w-16 flex-none" aria-hidden="true">
        <div className="door__leaf" style={{ transform: 'rotateY(calc(80deg * var(--sign)))' }} />
      </div>
      <div>
        <p className="font-display text-2xl font-bold">{title}</p>
        <p className="mt-2 max-w-xl">{body}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  )
}

/** Loading: quiet arches in place of the content, announced once to assistive technology. */
export function LoadingState({ label, count = 3 }: { label: string; count?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>
            <div className="arch skeleton h-40" />
            <div className="skeleton mt-4 h-4 w-2/3 rounded" />
            <div className="skeleton mt-2 h-6 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** A small label for a state or a kind of thing. */
export function Tag({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'accent' }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-sm font-medium ${tone === 'accent' ? 'bg-maroon-tint text-maroon' : 'bg-paper-deep text-ink'}`}>
      {children}
    </span>
  )
}
