import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/** Sends every request to its language address (/ar or /en). Sign-in checks join here in phase 3. */
export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\..*).*)',
}
