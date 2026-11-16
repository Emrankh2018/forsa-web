'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Shared behaviour of both arrivals: decide whether to play, end on any input, remember it for the
 * session, and remove the overlay when done. The page underneath is always rendered.
 */
export function useArrival(storageKey: string, finish: RefObject<() => void>) {
  const [state, setState] = useState<'pending' | 'playing' | 'done'>('pending')

  useEffect(() => {
    const root = document.documentElement
    const replay = /[?&]intro=1/.test(window.location.search)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // The stored value is this page load's start time, so a second effect run in the same load
    // (React strict mode in development) still plays instead of counting as a return visit.
    const thisLoad = String(performance.timeOrigin)
    let seen = false
    try {
      const stored = sessionStorage.getItem(storageKey)
      seen = Boolean(stored) && stored !== thisLoad
    } catch {
      // storage blocked: play once per page load
    }
    if (reduced || (seen && !replay)) {
      root.setAttribute('data-arrival-done', '')
      const frame = requestAnimationFrame(() => setState('done'))
      return () => cancelAnimationFrame(frame)
    }
    root.removeAttribute('data-arrival-done')
    try {
      sessionStorage.setItem(storageKey, thisLoad)
    } catch {
      // ignore
    }
    const frame = requestAnimationFrame(() => setState('playing'))

    const end = () => finish.current()
    const opts = { passive: true, capture: true } as const
    window.addEventListener('keydown', end, { capture: true })
    window.addEventListener('pointerdown', end, opts)
    window.addEventListener('wheel', end, opts)
    window.addEventListener('touchstart', end, opts)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', end, { capture: true })
      window.removeEventListener('pointerdown', end, opts)
      window.removeEventListener('wheel', end, opts)
      window.removeEventListener('touchstart', end, opts)
    }
  }, [storageKey, finish])

  const done = () => {
    document.documentElement.setAttribute('data-arrival-done', '')
    setState('done')
  }

  return { state, done }
}
