'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * The home page's one scroll moment: the doors inside start closed and swing to their angle when
 * they come into view, one after another. Without scripts, or under reduced motion, they simply
 * show at their angle (the closed state is added by script, never by the server).
 */
export function ScrollSwing({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('swing-wait')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
