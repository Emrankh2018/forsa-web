#!/usr/bin/env node
/**
 * Dead-control guard (roadmap step 7): every <button> in the web app either submits a form, has a
 * click handler, or receives its props by spread. The component showcase is exempt (it shows
 * buttons as samples).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web')
const exempt = [path.join(web, 'app', '[locale]', 'showcase', 'page.tsx')]

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.tsx')) out.push(p)
  }
  return out
}

/** Finds the end of a JSX opening tag, skipping `>` inside braces (arrow functions, comparisons). */
function openingTag(src, start) {
  let depth = 0
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return src.slice(start, i)
  }
  return src.slice(start)
}

const dead = []
for (const file of walk(web)) {
  if (exempt.includes(file)) continue
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/<button\b/g)) {
    const tag = openingTag(src, m.index)
    if (/onClick=|type="submit"|\{\.\.\./.test(tag)) continue
    dead.push(`${path.relative(web, file)}:${src.slice(0, m.index).split('\n').length}`)
  }
}
if (dead.length) {
  console.error('Buttons that do nothing (add an action, make them submit, or remove them):')
  for (const d of dead) console.error('  ' + d)
  process.exit(1)
}
console.log('Dead-control check passed.')
