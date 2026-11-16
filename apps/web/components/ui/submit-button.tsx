'use client'

import { useFormStatus } from 'react-dom'

/** The form's one action. While the form is sending it says so and cannot be pressed twice. */
export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn-arch" aria-disabled={pending || undefined} disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  )
}
