'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useArrival } from './use-arrival'

gsap.registerPlugin(useGSAP)

/**
 * Direction B arrival: blank paper; the door is drawn as one line rising from the floor; the floor
 * stretches into the page's first line and the bar drops in at its start; the door fades and the
 * line settles exactly where the page's own first line sits ([data-first-line]), so the page takes
 * over without a jump. Only transform, opacity and clip-path animate.
 */
export function ArrivalLine({ skipLabel, dir }: { skipLabel: string; dir: 'rtl' | 'ltr' }) {
  const scope = useRef<HTMLDivElement>(null)
  const finish = useRef<() => void>(() => {})
  const { state, done } = useArrival('forsa.arrival.b', finish)

  useGSAP(
    () => {
      if (state !== 'playing' || !scope.current) return
      const q = gsap.utils.selector(scope)
      const svg = scope.current.querySelector<SVGSVGElement>('.line-door')!
      const line = scope.current.querySelector<HTMLElement>('.line-rule')!
      const box = svg.getBoundingClientRect()
      const floorY = box.bottom - (box.height * 6) / 240

      const target = document.querySelector<HTMLElement>('[data-first-line]')
      const t = target?.getBoundingClientRect()
      const left = t ? t.left : 16
      const width = t ? t.width : window.innerWidth - 32
      const targetY = t && t.top < window.innerHeight ? t.top : floorY

      gsap.set(line, { left, width, top: floorY, scaleX: 0, transformOrigin: dir === 'rtl' ? '100% 50%' : '0% 50%' })
      gsap.set(q('.line-door'), { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(q('.line-bar'), { y: -14, opacity: 0 })

      const tl = gsap.timeline({ onComplete: done })
      tl.to(q('.line-door'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' })
        .to(line, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.1')
        .to(q('.line-bar'), { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.25')
        .to(q('.line-door'), { opacity: 0, duration: 0.3 }, '+=0.15')
        .to(line, { y: targetY - floorY, duration: 0.6, ease: 'power3.inOut' }, '<')
        .to(q('.line-paper'), { opacity: 0, duration: 0.4 }, '-=0.25')
        .to(line, { opacity: 0, duration: 0.2 })

      finish.current = () => {
        tl.kill()
        gsap.to(scope.current, { opacity: 0, duration: 0.2, onComplete: done })
      }
    },
    { scope, dependencies: [state] },
  )

  if (state === 'done') return null
  return (
    <div ref={scope} className="arrival arrival-line" aria-hidden="true">
      <div className="line-paper" />
      <svg viewBox="46 26 208 240" className="line-door">
        <path d="M70 262V132a80 80 0 0 1 160 0v130" fill="none" stroke="var(--color-ink)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="line-rule first-line-static">
        <span className="line-bar" />
      </div>
      <span className="arrival-hint">{skipLabel}</span>
    </div>
  )
}
