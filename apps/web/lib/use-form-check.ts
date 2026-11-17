'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { z } from 'zod'
import { fieldErrors } from '@forsa/shared'

/**
 * Checks form data against a shared rule set (packages/shared/src/schemas/forms.ts) and keeps the
 * translated message for each field. The same rules will run on the server once it exists.
 */
export function useFormCheck() {
  const t = useTranslations('forms.errors')
  const [errors, setErrors] = useState<Record<string, string>>({})
  function check<S extends z.ZodType>(schema: S, data: unknown, only?: string[]): z.output<S> | null {
    const r = schema.safeParse(data)
    if (r.success) {
      setErrors({})
      return r.data
    }
    const all = fieldErrors(r.error)
    const keys = Object.keys(all).filter((k) => !only || only.includes(k))
    setErrors(Object.fromEntries(keys.map((k) => [k, t(all[k] as 'required')])))
    return keys.length ? null : (data as z.output<S>)
  }
  return { errors, check, clear: () => setErrors({}) }
}
