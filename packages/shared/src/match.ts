/**
 * "For you" ordering (plan V4 section 10): items whose fields overlap the participant's come first,
 * the most overlap first; ties keep their original order. No AI, no hidden scoring.
 */
export function rankForYou<T>(items: readonly T[], itemFields: (item: T) => readonly string[], myFields: readonly string[]): T[] {
  const mine = new Set(myFields)
  return items
    .map((item, index) => ({ item, index, score: itemFields(item).filter((f) => mine.has(f)).length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((x) => x.item)
}
