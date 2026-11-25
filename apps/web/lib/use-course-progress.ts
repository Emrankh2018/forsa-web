'use client'

import { useSyncExternalStore } from 'react'

const progressInMemory = new Map<string, string>()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function readProgress(key: string) {
  const current = progressInMemory.get(key)
  if (current !== undefined) return current
  try {
    return window.sessionStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

export function useCourseProgress(courseSlug: string, total: number, initialDone: number) {
  const key = `forsa.course.${courseSlug}`
  const saved = useSyncExternalStore(subscribe, () => readProgress(key), () => '')
  const done = new Set(Array.from({ length: Math.min(total, initialDone) }, (_, i) => i + 1))
  if (saved) {
    try {
      const lessons: unknown = JSON.parse(saved)
      if (Array.isArray(lessons)) {
        for (const lesson of lessons) {
          if (typeof lesson === 'number' && Number.isInteger(lesson) && lesson >= 1 && lesson <= total) done.add(lesson)
        }
      }
    } catch {
      // Ignore malformed older browser state and keep the sample progress.
    }
  }

  function mark(lesson: number) {
    done.add(lesson)
    const value = JSON.stringify([...done].sort((a, b) => a - b))
    progressInMemory.set(key, value)
    try {
      window.sessionStorage.setItem(key, value)
    } catch {
      // In-tab navigation still uses the memory copy when storage is blocked.
    }
    for (const listener of listeners) listener()
  }

  return { done, mark }
}
