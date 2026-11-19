/**
 * Health address for the VPS uptime monitor and deploy script: answers 200 while the Node process
 * serves requests. Runs on every request (never cached), says nothing about the setup.
 */
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
}
