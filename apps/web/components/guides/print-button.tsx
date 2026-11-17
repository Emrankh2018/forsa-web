'use client'

/** Prints the guide (print styles hide the site frame and controls). */
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn-quiet -ms-3 underline underline-offset-4 print:hidden" onClick={() => window.print()}>
      {label}
    </button>
  )
}
