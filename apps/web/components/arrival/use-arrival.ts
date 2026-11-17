'use client'

import { useEffect, useState, type RefObject } from 'react'

/** Arrivals already shown in this page load (kept across moves inside the site, which do not reload). */
const shown = new Set<string>()

/**
 * Shared behaviour of both arrivals: decide whether to play, end on any input, remember it for the
 * session, and remove the overlay when done. The page underneath is always rendered.
 * It plays once per visit: the first page load in a tab. Coming back home inside the site, or
 * reloading, does not play it again; `?intro=1` replays it on purpose.
 */
export function useArrival(storageKey: string, finish: RefObject<() => void>) {
  const [state, setState] = useState<'pending' | 'playing' | 'done'>('pending')

  useEffect(() => {
    const root = document.documentElement
    const replay = /[?&]intro=1/.test(window.location.search)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let seen = shown.has(storageKey)
    try {
      seen ||= Boolean(sessionStorage.getItem(storageKey))
    } catch {
      // storage blocked: the in-memory record still stops replays inside the site
    }
    if (reduced || (seen && !replay) || (replay && shown.has(storageKey))) {
      root.setAttribute('data-arrival-done', '')
      const frame = requestAnimationFrame(() => setState('done'))
      return () => cancelAnimationFrame(frame)
    }
    root.removeAttribute('data-arrival-done')
    // Recorded only when it really starts: React's development double run cancels this frame first.
    const frame = requestAnimationFrame(() => {
      shown.add(storageKey)
      try {
        sessionStorage.setItem(storageKey, '1')
      } catch {
        // ignore
      }
      setState('playing')
    })

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
