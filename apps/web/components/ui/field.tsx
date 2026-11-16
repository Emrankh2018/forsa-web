import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

/**
 * Form fields. Every field has a visible label, an optional hint, and an error that is announced
 * and linked with aria-describedby. Values are kept by the caller (forms re-render with what was
 * typed after a failed submit).
 */
type Base = { id: string; label: string; hint?: string; error?: string; required?: boolean; requiredLabel?: string }

function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
}

function Frame({ id, label, hint, error, required, requiredLabel, children }: Base & { children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id} className="block font-medium">
        {label}
        {required ? <span className="ms-1 text-maroon" aria-hidden="true">*</span> : null}
        {required && requiredLabel ? <span className="sr-only"> {requiredLabel}</span> : null}
      </label>
      {hint ? <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-maroon">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const control =
  'block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-maroon aria-[invalid=true]:border-maroon min-h-12'

export function TextField({ id, label, hint, error, required, requiredLabel, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  // Addresses, links and numbers are written left to right even on Arabic pages.
  const ltr = rest.type === 'email' || rest.type === 'url' || rest.type === 'tel'
  return (
    <Frame {...{ id, label, hint, error, required, requiredLabel }}>
      <input id={id} name={id} dir={ltr ? 'ltr' : undefined} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error)} className={control} {...rest} />
    </Frame>
  )
}

export function TextArea({ id, label, hint, error, required, requiredLabel, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Frame {...{ id, label, hint, error, required, requiredLabel }}>
      <textarea id={id} name={id} required={required} rows={5} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error)} className={control} {...rest} />
    </Frame>
  )
}

export function SelectField({ id, label, hint, error, required, requiredLabel, options, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> }) {
  return (
    <Frame {...{ id, label, hint, error, required, requiredLabel }}>
      <select id={id} name={id} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error)} className={control} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Frame>
  )
}

/** A group of checkboxes with one legend, one hint and one error for the whole group. */
export function CheckboxGroup({
  id, legend, hint, error, options, values = [], required, requiredLabel,
}: { id: string; legend: string; hint?: string; error?: string; options: Array<{ value: string; label: string }>; values?: string[]; required?: boolean; requiredLabel?: string }) {
  return (
    <fieldset className="field" aria-describedby={describedBy(id, hint, error)} aria-invalid={error ? true : undefined}>
      <legend className="font-medium">
        {legend}
        {required ? <span className="ms-1 text-maroon" aria-hidden="true">*</span> : null}
        {required && requiredLabel ? <span className="sr-only"> {requiredLabel}</span> : null}
      </legend>
      {hint ? <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">{hint}</p> : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line px-3 has-[:checked]:border-maroon has-[:checked]:bg-maroon-tint">
            <input type="checkbox" name={id} value={o.value} defaultChecked={values.includes(o.value)} className="size-5 accent-maroon" />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error ? <p id={`${id}-error`} className="mt-2 text-sm font-medium text-maroon">{error}</p> : null}
    </fieldset>
  )
}
