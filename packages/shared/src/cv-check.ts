/**
 * Checks one CV experience line against the CV guide's advice: start with what you did, not with
 * a duty or "I"; end with a result; keep it short. Works for Arabic and English lines. Runs in the
 * browser; nothing is sent anywhere.
 */
export type CvIssue = 'weakStart' | 'firstPerson' | 'noResult' | 'tooLong'

const weakStart = [/^(responsible for|in charge of|duties|tasks include|worked on)\b/i, /^(مسؤول|مسؤولة|مسئول|مسئولة|مهامي|المسؤولية عن)/]
const firstPerson = [/^(i|i'm|i am)\b/i, /^(أنا|انا)\s/]
const resultMarkers = [
  /\b(result(ed|ing)?|increas(ed|ing)|reduc(ed|ing)|led to|so that|published|delivered|won|accepted|launched|grew|saved|reached|cut)\b/i,
  /(نتيجة|مما|أدى|أدّى|زاد|زادت|خفّض|خفض|قلّل|قلل|نُشر|نشرت|نشره|سلّمت|سلمت|فاز|قُبل|قبل العمل|أطلق|ارتفع|وفّر|وفر|وصل)/,
]
const digits = /[0-9٠-٩۰-۹]/

export function checkCvLine(line: string): CvIssue[] {
  const text = line.trim()
  if (!text) return []
  const issues: CvIssue[] = []
  if (weakStart.some((r) => r.test(text))) issues.push('weakStart')
  if (firstPerson.some((r) => r.test(text))) issues.push('firstPerson')
  if (!digits.test(text) && !resultMarkers.some((r) => r.test(text))) issues.push('noResult')
  if (text.split(/\s+/).length > 25) issues.push('tooLong')
  return issues
}
