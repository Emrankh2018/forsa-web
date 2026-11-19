#!/usr/bin/env node
/**
 * Browser messages guard: the root layout sends the browser only the message groups listed in
 * apps/web/lib/client-messages.ts. Fails if any file uses useTranslations with a group missing from
 * that list (it would show a missing-text error in the browser), or with no group / a computed one
 * (which the list cannot cover).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web')
const listFile = readFileSync(path.join(web, 'lib', 'client-messages.ts'), 'utf8')
const listed = new Set([...listFile.slice(listFile.indexOf('['), listFile.indexOf(']')).matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1]))

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(name)) out.push(p)
  }
  return out
}

const problems = []
for (const file of walk(web).filter((f) => !f.endsWith('client-messages.ts'))) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/useTranslations\(([^)]*)\)/g)) {
    const arg = m[1].trim()
    const ns = /^'([a-zA-Z]+)(\.[a-zA-Z.]+)?'$/.exec(arg)?.[1]
    if (!ns) problems.push(`${path.relative(web, file)}: useTranslations(${arg}) must name a fixed group`)
    else if (!listed.has(ns)) problems.push(`${path.relative(web, file)}: group '${ns}' is not in lib/client-messages.ts`)
  }
}
if (problems.length) {
  console.error('Browser messages check failed:')
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`Browser messages check passed (${listed.size} groups).`)
