import { createClient } from '@supabase/supabase-js'

/**
 * A database client with the public (publishable) key, for calls any visitor may make, such as
 * sending the partner form. Returns null when this copy of the site has no database settings yet;
 * callers then say so honestly instead of pretending to save. Sign-in clients come in phase 3.
 */
export function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
