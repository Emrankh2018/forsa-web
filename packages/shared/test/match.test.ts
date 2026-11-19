import { describe, expect, it } from 'vitest'
import { rankForYou } from '../src/match'

describe('for you ordering', () => {
  const items = [
    { id: 'a', fields: ['applied_ai'] },
    { id: 'b', fields: ['marketing_media'] },
    { id: 'c', fields: ['marketing_media', 'applied_ai'] },
    { id: 'd', fields: ['marketing_media'] },
  ]
  it('puts the most overlap first and keeps the original order for ties', () => {
    expect(rankForYou(items, (x) => x.fields, ['marketing_media', 'applied_ai']).map((x) => x.id)).toEqual(['c', 'a', 'b', 'd'])
    expect(rankForYou(items, (x) => x.fields, ['marketing_media']).map((x) => x.id)).toEqual(['b', 'c', 'd', 'a'])
  })
  it('leaves the order alone when the participant has no fields', () => {
    expect(rankForYou(items, (x) => x.fields, []).map((x) => x.id)).toEqual(['a', 'b', 'c', 'd'])
  })
})
