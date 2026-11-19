import { describe, expect, it } from 'vitest'
import { makeIcs } from '../src/calendar'

describe('calendar entry', () => {
  it('writes Qatar time as UTC, the right end, and a reminder the day before', () => {
    const ics = makeIcs({ uid: 'b1', title: 'CV, in thirty seconds', startsAt: '2026-12-05T17:00:00+03:00', minutes: 120, location: 'Online', url: 'https://forsa.example/en/me/learning' })
    expect(ics).toContain('DTSTART:20261205T140000Z')
    expect(ics).toContain('DTEND:20261205T160000Z')
    expect(ics).toContain('SUMMARY:CV\\, in thirty seconds')
    expect(ics).toContain('TRIGGER:-P1D')
    expect(ics.split('\r\n')[0]).toBe('BEGIN:VCALENDAR')
  })
})
