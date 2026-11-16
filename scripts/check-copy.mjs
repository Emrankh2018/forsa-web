#!/usr/bin/env node
/**
 * Copy checker (plan V4 section 10, "honest wording"). Fails when interface text breaks the wording
 * rules of production/STORY-AND-FACTS.md sections 7 and 8, or the V4 decisions (no money on
 * projects, no job promise). Also fails when a component holds Arabic text instead of reading it
 * from packages/shared/src/messages.
 *
 * Usage: node scripts/check-copy.mjs        (checks the repository)
 *        node scripts/check-copy.mjs --self-test
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Each rule: a pattern, the languages it applies to, and why it is banned. */
export const rules = [
  // Arabic wording (section 7)
  { re: /المستفيد/u, why: 'say المشارك, not المستفيد' },
  { re: /مهمة حرة|عمل حر/u, why: 'a company project is مشروع' },
  { re: /راتب|أجر شهري/u, why: 'participants are not paid a salary' },
  { re: /مكافأة|مكافآت/u, why: 'V4: no reward on projects (D-106)' },
  { re: /خريجو الثانوية/u, why: 'audience is new graduates and near-graduates' },
  { re: /\bQAR\b/u, lang: 'ar', why: 'Arabic text says ريال قطري, not QAR' },
  { re: /[0-9]/u, lang: 'ar', why: 'Arabic text uses Arabic-Indic numerals', allow: [/^English$/], strip: /=\d+/g },
  // Promises and claims (section 8)
  { re: /نضمن لك (?:وظيفة|عملًا|عملا)|وظيفة مضمونة|ضمان وظيفة|ضمان التوظيف/u, why: 'never promise a job' },
  { re: /(?<!(?:not|never|n't) )guarantee(?:d|s)? (?:a |you a )?(?:job|employment|hire)|job guarantee/i, why: 'never promise a job' },
  { re: /unemployment rate|نسبة البطالة|معدل البطالة/i, why: 'no unsourced statistics' },
  // Money on projects (D-106)
  { re: /\breward(?:s|ed)?\b|\bsalary\b|\bpaid project/i, lang: 'en', why: 'V4: projects carry no money' },
  { re: /free labou?r/i, lang: 'en', why: 'never frame projects this way' },
]

export function checkText(text, lang) {
  const problems = []
  for (const rule of rules) {
    if (rule.lang && rule.lang !== lang) continue
    if (rule.allow?.some((a) => a.test(text))) continue
    const subject = rule.strip ? text.replace(rule.strip, '') : text
    if (rule.re.test(subject)) problems.push(rule.why)
  }
  return problems
}

function strings(value, prefix = '') {
  if (typeof value === 'string') return [[prefix, value]]
  return Object.entries(value).flatMap(([k, v]) => strings(v, prefix ? `${prefix}.${k}` : k))
}

function walk(dir, exts) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full, exts))
    else if (exts.some((e) => name.endsWith(e))) out.push(full)
  }
  return out
}

/**
 * Loads the shared messages and sample data by transpiling the TypeScript sources into a temporary
 * folder (type-only imports disappear; relative imports get the .mjs extension).
 */
async function loadShared() {
  const ts = (await import('typescript')).default
  const srcRoot = path.join(root, 'packages/shared/src')
  const out = mkdtempSync(path.join(tmpdir(), 'forsa-copy-'))
  for (const file of walk(srcRoot, ['.ts'])) {
    const rel = path.relative(srcRoot, file).replace(/\.ts$/, '.mjs')
    const js = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
    }).outputText.replace(/from '(\.{1,2}\/[^']+)'/g, (m, spec) => {
      const target = path.resolve(path.dirname(file), spec)
      const isDir = existsSync(target) && statSync(target).isDirectory()
      return `from '${spec}${isDir ? '/index' : ''}.mjs'`
    })
    mkdirSync(path.dirname(path.join(out, rel)), { recursive: true })
    writeFileSync(path.join(out, rel), js)
  }
  const { messages } = await import(pathToFileURL(path.join(out, 'messages/index.mjs')).href)
  const seed = await import(pathToFileURL(path.join(out, 'seed/sample.mjs')).href)
  rmSync(out, { recursive: true, force: true })
  return { messages, seed }
}

/** Every bilingual { ar, en } pair inside the sample data. */
function bilingual(value, at = 'seed') {
  if (!value || typeof value !== 'object') return []
  if (typeof value.ar === 'string' && typeof value.en === 'string') return [[at, value]]
  return Object.entries(value).flatMap(([k, v]) => bilingual(v, `${at}.${k}`))
}

async function main() {
  const failures = []
  const { messages, seed } = await loadShared()
  for (const lang of ['ar', 'en']) {
    for (const [key, text] of strings(messages[lang])) {
      for (const why of checkText(text, lang)) failures.push(`messages/${lang}: ${key}: ${why}: "${text}"`)
    }
  }
  for (const [key, pair] of bilingual({ projects: seed.sampleProjects, workshops: seed.sampleWorkshops, participant: seed.sampleParticipant, fields: seed.fields })) {
    for (const lang of ['ar', 'en']) {
      for (const why of checkText(pair[lang], lang)) failures.push(`${key}.${lang}: ${why}: "${pair[lang]}"`)
    }
  }
  // No Arabic text inside components or pages: it belongs in the messages files.
  const arabic = /[؀-ۿ]/u
  for (const file of walk(path.join(root, 'apps/web'), ['.tsx', '.ts'])) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      const code = line.replace(/\/\/.*$/, '').replace(/^\s*\*.*$/, '')
      if (arabic.test(code)) failures.push(`${path.relative(root, file)}:${i + 1}: Arabic text in a component; move it to packages/shared/src/messages`)
    })
  }
  if (failures.length) {
    console.error(`Copy check failed (${failures.length}):\n- ${failures.join('\n- ')}`)
    process.exit(1)
  }
  console.log('Copy check passed.')
}

function selfTest() {
  const cases = [
    ['ستحصل على مكافأة', 'ar', true],
    ['نضمن لك وظيفة', 'ar', true],
    ['السعر 250 ريال', 'ar', true],
    ['السعر ٢٥٠ ريال قطري', 'ar', false],
    ['English', 'ar', false],
    ['We guarantee you a job', 'en', true],
    ['Earn a reward', 'en', true],
    ['QAR 250 per workshop', 'en', false],
    ['Real projects from companies', 'en', false],
    ['Finishing a project does not guarantee a job', 'en', false],
    ['{count, plural, =0 {لا مقاعد} other {{n} مقعدًا}}', 'ar', false],
  ]
  let bad = 0
  for (const [text, lang, shouldFail] of cases) {
    const failed = checkText(text, lang).length > 0
    if (failed !== shouldFail) {
      bad++
      console.error(`self-test: "${text}" (${lang}) expected ${shouldFail ? 'fail' : 'pass'}`)
    }
  }
  if (bad) process.exit(1)
  console.log(`Copy checker self-test passed (${cases.length} cases).`)
}

if (process.argv.includes('--self-test')) selfTest()
else await main()
