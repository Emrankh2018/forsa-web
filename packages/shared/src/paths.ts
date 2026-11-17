/**
 * Only an address on this site counts as a place to return to after sign-in: one leading slash,
 * no scheme, no protocol-relative "//", no backslashes, no control characters. Anything else is
 * ignored (no open redirect).
 */
export function safeReturnPath(next: unknown): string | null {
  if (typeof next !== 'string') return null
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\') || next.length > 200) return null
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(next)) return null
  return next
}
