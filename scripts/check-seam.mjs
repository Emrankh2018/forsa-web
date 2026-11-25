#!/usr/bin/env node
/**
 * The data seam guard (roadmap step 5): screens read and write only through apps/web/lib/data.
 * Fails if any other file in apps/web imports the sample data or guide content directly.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web')
const allowed = path.join(web, 'lib', 'data') + path.sep
const banned = /from ['"]@forsa\/shared\/(seed|seed\/app|content|content\/legal)['"]/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|mjs|js)$/.test(name)) out.push(p)
  }
  return out
}

const bad = walk(web).filter((f) => !f.startsWith(allowed) && banned.test(readFileSync(f, 'utf8')))
if (bad.length) {
  console.error('Data seam broken: these files read sample data directly instead of through apps/web/lib/data:')
  for (const f of bad) console.error('  ' + path.relative(web, f))
  process.exit(1)
}
console.log('Data seam check passed.')
