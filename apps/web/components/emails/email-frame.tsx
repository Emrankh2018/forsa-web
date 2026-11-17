import type { ReactNode } from 'react'

/**
 * An email as Forsa sends it: paper, the door mark, the first line, one message and one action.
 * Inline styles and simple blocks on purpose, so the same markup can become the real email
 * template (email clients ignore stylesheets) once a sender exists.
 */
export function EmailFrame({ dir, brand, title, body, cta, footer, children }: {
  dir: 'rtl' | 'ltr'
  brand: string
  title: string
  body: string
  cta?: string
  footer: string
  children?: ReactNode
}) {
  const paper = '#F4EFE6'
  const ink = '#17221F'
  const soft = '#55615D'
  const maroon = '#8A1F3B'
  return (
    <div dir={dir} style={{ background: paper, color: ink, padding: '28px 24px', maxWidth: 560, margin: '0 auto', borderRadius: 8, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg viewBox="46 26 208 274" width="22" height="29" aria-hidden="true">
          <path d="M70 262V132a80 80 0 0 1 160 0v130z" fill={maroon} />
          <path d="M70 262V132A80 80 0 0 1 186 60.56V262z" fill={ink} />
          <path d="M56 262V132a94 94 0 0 1 188 0v130" fill="none" stroke={ink} strokeWidth="12" />
        </svg>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{brand}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 22px' }} aria-hidden="true">
        <span style={{ width: 28, height: 4, background: maroon }} />
        <span style={{ flex: 1, height: 1, background: '#CDBFA8' }} />
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, lineHeight: 1.25, margin: 0 }}>{title}</p>
      <p style={{ fontSize: 16, lineHeight: 1.7, margin: '14px 0 0' }}>{body}</p>
      {children}
      {cta ? (
        <p style={{ margin: '24px 0 0' }}>
          <span style={{ display: 'inline-block', background: maroon, color: paper, padding: '12px 22px 10px', borderRadius: '999px 999px 6px 6px', fontWeight: 500 }}>{cta}</span>
        </p>
      ) : null}
      <p style={{ fontSize: 12, lineHeight: 1.6, color: soft, margin: '28px 0 0', borderTop: '1px solid #CDBFA8', paddingTop: 14 }}>{footer}</p>
    </div>
  )
}
