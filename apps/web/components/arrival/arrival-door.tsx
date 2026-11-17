'use client'

import { useEffect, useRef } from 'react'
import { useArrival } from './use-arrival'

/**
 * The arrival (decision D-114): night, the Forsa door closed; the leaf swings on its hinge until the door
 * stands as it does in the logo, light falls on the floor, then the view passes through the gap.
 * Geometry is the logo's own (design/logo/forsa-symbol.svg). Only transform and opacity animate.
 * GSAP is fetched only when the arrival plays, so return visits and reduced motion never load it.
 */
export function ArrivalDoor({ skipLabel }: { skipLabel: string }) {
  const scope = useRef<HTMLDivElement>(null)
  const finish = useRef<() => void>(() => {})
  const { state, done } = useArrival('forsa.arrival', finish)

  const doneRef = useRef(done)
  useEffect(() => {
    doneRef.current = done
  })

  useEffect(() => {
    if (state !== 'playing') return
    let cancelled = false
    let kill = () => {}
    import('gsap').then(({ gsap }) => {
      const root = scope.current
      if (cancelled || !root) return
      const q = gsap.utils.selector(root)
      const end = () => doneRef.current()
      gsap.set(q('.door-leaf'), { svgOrigin: '70 262', scaleX: 0.985 })
      gsap.set(q('.door-floor'), { svgOrigin: '186 262', scaleY: 0 })
      gsap.set(q('.door-svg'), { opacity: 0, scale: 0.94, transformOrigin: '50% 60%' })

      const tl = gsap.timeline({ onComplete: end })
      tl.to(q('.door-svg'), { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
        .to(q('.door-leaf'), { scaleX: 0.725, duration: 0.9, ease: 'power2.inOut' }, '+=0.1')
        .to(q('.door-floor'), { scaleY: 1, duration: 0.6, ease: 'power2.out' }, '<0.35')
        .to(q('.door-svg'), { scale: 18, transformOrigin: '77.9% 52.6%', duration: 0.8, ease: 'power3.in' }, '+=0.15')
        .to(root, { opacity: 0, duration: 0.35, ease: 'power1.out' }, '-=0.2')

      kill = () => tl.kill()
      finish.current = () => {
        tl.kill()
        gsap.to(root, { opacity: 0, duration: 0.2, onComplete: end })
      }
    }).catch(() => doneRef.current())
    // Any input before GSAP arrives ends the arrival at once.
    finish.current = () => doneRef.current()
    return () => {
      cancelled = true
      kill()
    }
  }, [state])

  if (state === 'done') return null
  return (
    <div ref={scope} className="arrival arrival-door" aria-hidden="true">
      <svg viewBox="46 26 208 274" className="door-svg">
        <path d="M70 262V132a80 80 0 0 1 160 0v130z" fill="var(--color-sand)" />
        <path className="door-leaf" d="M70 262V132a80 80 0 0 1 160 0v130z" fill="#22312D" />
        <path d="M56 262V132a94 94 0 0 1 188 0v130" fill="none" stroke="var(--color-on-night)" strokeWidth="12" />
        <path className="door-floor" d="M186 262h44l-6 34h-104z" fill="var(--color-sand)" />
      </svg>
      <span className="arrival-hint">{skipLabel}</span>
    </div>
  )
}
