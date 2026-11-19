import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { RoomDoors } from '@/components/site/room-doors'

/**
 * The end of every page: the room doors (except on the home page, which is the hall itself), then a
 * quiet footer with links, the honest line about jobs, and the sample-data note when needed.
 */
export async function SiteFooter({ sample = false, rooms = true }: { sample?: boolean; rooms?: boolean }) {
  const t = await getTranslations('footer')
  const s = await getTranslations()
  const h = await getTranslations('home')
  const links = [
    ['/about', t('about')],
    ['/faq', t('faq')],
    ['/contact', t('contact')],
    ['/guides', t('guides')],
    ['/partners', t('partners')],
    ['/trainers', t('trainers')],
    ['/privacy', t('privacy')],
    ['/terms', t('terms')],
  ] as const
  return (
    <>
    {rooms ? (
      <RoomDoors
        title={t('roomsTitle')}
        rooms={[
          { href: '/projects', label: h('roomProjects') },
          { href: '/learn', label: h('roomTraining'), also: ['/workshops', '/sessions', '/courses', '/guides'] },
          { href: '/partners', label: h('roomPartners'), also: ['/trainers'] },
          { href: '/join', label: h('roomYours'), also: ['/sign-in'], yours: true },
        ]}
      />
    ) : null}
    <footer className={`mx-auto ${rooms ? 'mt-16' : 'mt-24'} max-w-7xl border-t border-line px-4 py-10 sm:px-8`}>
      <nav aria-label={t('label')}>
        <ul className="-mx-3 flex flex-wrap gap-x-2" role="list">
          {links.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="btn-quiet">{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-6 text-sm">{t('noJobPromise')}</p>
      {sample ? <p className="mt-2 text-sm text-ink-soft">{s('sample')}</p> : null}
      <p className="mt-6 text-sm text-ink-soft">{t('rights')}</p>
    </footer>
    </>
  )
}
