'use client'

import { Link, usePathname } from '@/i18n/navigation'

export type AreaTab = { href: string; label: string; exact?: boolean; badge?: string }

/** Sections of an area as a row of doorways; the one you are in is filled. */
export function AreaTabs({ label, tabs }: { label: string; tabs: AreaTab[] }) {
  const pathname = usePathname()
  const isOn = (t: AreaTab) => (t.exact ? pathname === t.href : pathname === t.href || pathname.startsWith(`${t.href}/`))
  return (
    <nav aria-label={label} className="mt-4 border-b border-line">
      <ul className="-mb-px flex gap-1 overflow-x-auto" role="list">
        {tabs.map((t) => {
          const on = isOn(t)
          return (
            <li key={t.href} className="flex-none">
              <Link href={t.href} aria-current={on ? 'page' : undefined} className={`door-tab ${on ? 'door-tab--on' : ''}`}>
                {t.label}
                {t.badge ? <span className="door-tab__badge">{t.badge}</span> : null}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
