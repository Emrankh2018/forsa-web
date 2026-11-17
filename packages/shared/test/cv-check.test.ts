import { describe, expect, it } from 'vitest'
import { checkCvLine } from '../src'

describe('CV line check', () => {
  it('passes a line that starts with an action and has a result', () => {
    expect(checkCvLine('Designed three posts for a café launch, published on its account')).toEqual([])
    expect(checkCvLine('صمّمت ثلاثة منشورات لحملة إطلاق مقهى، ونُشرت على حسابه')).toEqual([])
    expect(checkCvLine('Ran the club account and grew it to 1,200 followers')).toEqual([])
    expect(checkCvLine('أدرت حساب النادي ووصل إلى ١٢٠٠ متابع')).toEqual([])
  })
  it('flags duties, "I", missing results and long lines', () => {
    expect(checkCvLine('Responsible for social media at the university club')).toEqual(['weakStart', 'noResult'])
    expect(checkCvLine('مسؤول عن حسابات التواصل في نادي الجامعة')).toEqual(['weakStart', 'noResult'])
    expect(checkCvLine('I helped the team with design work')).toEqual(['firstPerson', 'noResult'])
    expect(checkCvLine('أنا ساعدت الفريق في التصميم')).toEqual(['firstPerson', 'noResult'])
    expect(checkCvLine(Array.from({ length: 30 }, () => 'word').join(' ') + ' 5')).toEqual(['tooLong'])
  })
  it('ignores empty lines', () => {
    expect(checkCvLine('   ')).toEqual([])
  })
})
