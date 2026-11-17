'use client'

import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

/**
 * Smooth scrolling on the public pages (plan V4: Lenis on public pages only, never in the tools).
 * Not started under reduced motion; anchor links keep working; removed when the page goes.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let lenis: { destroy: () => void } | null = null
    let cancelled = false
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({ autoRaf: true, anchors: true })
    })
    return () => {
      cancelled = true
      lenis?.destroy()
    }
  }, [])
  return null
}
