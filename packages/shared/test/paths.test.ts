import { describe, expect, it } from 'vitest'
import { privateCrawlRules, robotsRuleMatches, safeReturnPath } from '../src'

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

describe('privateCrawlRules', () => {
  const rules = [...privateCrawlRules(), '/*/book', '/api/']
  const blocked = (path: string) => rules.some((r) => robotsRuleMatches(r, path))

  it('blocks every private area and its pages in both languages', () => {
    for (const p of ['/ar/me', '/en/me/projects', '/ar/org', '/en/trainer', '/ar/trainer/workshops/new', '/en/admin/orders', '/ar/showcase', '/en/test', '/ar/sign-in', '/en/join/participant', '/ar/p/reem', '/ar/workshops/cv-thirty-seconds/book', '/api/health']) {
      expect(blocked(p), p).toBe(true)
    }
  })

  it('never blocks a public page that shares a prefix with a private area', () => {
    for (const p of ['/ar', '/en/projects', '/ar/projects/cafe-launch-campaign', '/en/partners', '/ar/privacy', '/en/trainers', '/ar/terms', '/en/workshops', '/ar/workshops/cv-thirty-seconds', '/en/contact', '/ar/about', '/en/guides/interview', '/ar/learn', '/en/courses/content-basics', '/ar/faq', '/en/sessions']) {
      expect(blocked(p), p).toBe(false)
    }
  })
})
