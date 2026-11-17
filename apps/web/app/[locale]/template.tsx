import { ViewTransition } from 'react'

/**
 * Passing a threshold: on every navigation the old page steps back quickly and the new one opens
 * from the middle, like two door leaves (CSS in app/site.css). Instant under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="threshold-in" exit="threshold-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  )
}
