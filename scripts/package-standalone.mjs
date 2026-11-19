#!/usr/bin/env node
/**
 * Turns `npm run build` output into a folder that runs on the VPS with `node apps/web/server.js`
 * (no npm install on the server). Next.js leaves out `public/` and `.next/static/` from the
 * standalone folder on purpose; this copies them in.
 *
 *   node scripts/package-standalone.mjs            prepare apps/web/.next/standalone
 *   node scripts/package-standalone.mjs --serve    prepare, then run it on PORT (default 8765)
 *
 * The browser suite uses --serve when E2E_STANDALONE=1, so the same files the VPS gets are tested.
 * --serve listens on every local address (IPv4 and IPv6, so `localhost` works everywhere); on the VPS
 * the systemd service sets HOSTNAME=127.0.0.1 instead.
 */
import { cpSync, existsSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const web = join(root, 'apps', 'web')
const standalone = join(web, '.next', 'standalone')
const target = join(standalone, 'apps', 'web')
const server = join(target, 'server.js')

if (!existsSync(server)) {
  console.error(`No standalone server at ${server}. Run \`npm run build\` first (next.config.ts sets output: 'standalone').`)
  process.exit(1)
}

for (const [from, to] of [
  [join(web, 'public'), join(target, 'public')],
  [join(web, '.next', 'static'), join(target, '.next', 'static')],
]) {
  rmSync(to, { recursive: true, force: true })
  cpSync(from, to, { recursive: true })
}
console.log(`Standalone ready: ${standalone}\nStart it with: node apps/web/server.js (inside that folder)`)

if (process.argv.includes('--serve')) {
  const child = spawn(process.execPath, [server], {
    cwd: standalone,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', PORT: process.env.PORT ?? '8765', HOSTNAME: process.env.HOSTNAME_BIND ?? '::' },
  })
  const stop = () => child.kill()
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
  child.on('exit', (code) => process.exit(code ?? 0))
}
