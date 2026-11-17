'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { Door } from '@/components/site/door'

type Room = { href: string; label: string; also?: string[]; yours?: boolean }

/**
 * The doors at the end of every inner page: the same rooms as the home hall, small. The room you
 * are in stands open and is marked as current; the others are ajar; your own door is closed.
 */
export function RoomDoors({ title, rooms }: { title: string; rooms: Room[] }) {
  const pathname = usePathname()
  const isHere = (r: Room) => [r.href, ...(r.also ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`))
  return (
    <nav aria-label={title} className="mx-auto mt-24 max-w-7xl px-4 sm:px-8">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="first-line first-line-static mt-3 w-32" aria-hidden="true" />
      <ul className="mt-8 grid grid-cols-4 gap-3 sm:gap-6 md:max-w-3xl" role="list">
        {rooms.map((r) => {
          const here = isHere(r)
          return (
            <li key={r.href}>
              <Link href={r.href} aria-current={here ? 'page' : undefined} className="room block rounded-md">
                <Door
                  open={here ? 80 : r.yours ? 4 : 40}
                  openHover={r.yours ? 70 : 80}
                  keyhole={r.yours && !here}
                  className={`h-24 sm:h-32 ${r.yours ? 'door--yours' : ''}`}
                />
                <span className={`mt-3 block text-sm leading-snug sm:text-base ${here ? 'font-bold text-maroon' : 'font-medium'}`}>{r.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
