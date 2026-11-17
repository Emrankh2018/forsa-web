'use client'

import { Link, usePathname } from '@/i18n/navigation'

type NavLink = { href: string; label: string; also?: string[] }

/**
 * Main navigation links. The current area is marked (aria-current and the maroon first line under
 * it), so you always know which room you are in. `extra` shows only on phones (sign in).
 */
export function NavLinks({ links, extra }: { links: NavLink[]; extra?: NavLink }) {
  const pathname = usePathname()
  const current = (l: NavLink) => [l.href, ...(l.also ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`))
  return (
    <>
      {links.map((l) => {
        const on = current(l)
        return (
          <Link key={l.href} href={l.href} aria-current={on ? 'page' : undefined} className={`btn-quiet nav-link ${on ? 'nav-link--on' : ''}`}>
            {l.label}
          </Link>
        )
      })}
      {extra ? (
        <Link href={extra.href} className="btn-quiet nav-link ms-auto sm:hidden">
          {extra.label}
        </Link>
      ) : null}
    </>
  )
}
