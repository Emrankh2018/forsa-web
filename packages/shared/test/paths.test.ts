import { describe, expect, it } from 'vitest'
import { safeReturnPath } from '../src'

describe('return path after sign-in', () => {
  it('keeps addresses on this site', () => {
    expect(safeReturnPath('/projects/cafe-launch-campaign')).toBe('/projects/cafe-launch-campaign')
    expect(safeReturnPath('/workshops?x=1')).toBe('/workshops?x=1')
  })
  it('refuses anything that could leave the site', () => {
    const bad: unknown[] = [
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      'javascript:alert(1)',
      'projects',
      '',
      '/a\nb',
      42,
      undefined,
      '/' + 'x'.repeat(250),
    ]
    for (const value of bad) expect(safeReturnPath(value)).toBeNull()
  })
})
