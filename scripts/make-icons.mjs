#!/usr/bin/env node
/**
 * Draws the site icon (the logo's door, apps/web/public/icon.svg) into the raster files that
 * browsers and phones ask for: favicon.ico (16, 32, 48), apple-icon.png (180), icon-192.png and
 * icon-512.png for the web app manifest, and icon-maskable-512.png (extra margin for round masks).
 * Run after changing the icon: `node scripts/make-icons.mjs`. Uses the Playwright browser already
 * installed for the tests; nothing is downloaded.
 */
import { Buffer } from 'node:buffer'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'apps/web/public/icon.svg'), 'utf8')
const out = join(root, 'apps/web/public')
const paper = '#F4EFE6'

/** padding: share of the side left empty around the door. */
async function draw(page, size, padding) {
  const inner = Math.round(size * (1 - padding * 2))
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${paper}">` +
      `<div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body></html>`,
  )
  return page.screenshot({ type: 'png', omitBackground: false })
}

/** An .ico that holds PNG images (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  const entries = []
  let offset = 6 + 16 * pngs.length
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    entries.push(e)
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })
const small = []
for (const size of [16, 32, 48]) small.push({ size, data: await draw(page, size, 0.04) })
writeFileSync(join(out, 'favicon.ico'), ico(small))
writeFileSync(join(out, 'apple-icon.png'), await draw(page, 180, 0.1))
writeFileSync(join(out, 'icon-192.png'), await draw(page, 192, 0.08))
writeFileSync(join(out, 'icon-512.png'), await draw(page, 512, 0.08))
writeFileSync(join(out, 'icon-maskable-512.png'), await draw(page, 512, 0.2))
await browser.close()
console.log('Icons written to apps/web/public: favicon.ico, apple-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png')
