import type { ReactNode } from 'react'

/**
 * On phones and tablets the page's one action stays reachable at the bottom of the screen, with the
 * fact that matters most beside it (seats left, the price). Desktop shows the side panel instead.
 */
export function PhoneActionBar({ fact, children, label }: { fact: ReactNode; children: ReactNode; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className="phone-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-sm lg:hidden"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <div className="min-w-0 flex-1 text-sm leading-snug">{fact}</div>
        <div className="flex-none">{children}</div>
      </div>
    </div>
  )
}
