import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

/** A quiet footer on paper: links, the honest line about jobs, and the sample-data note when needed. */
export async function SiteFooter({ sample = false }: { sample?: boolean }) {
  const t = await getTranslations('footer')
  const s = await getTranslations()
  const links = [
    ['/about', t('about')],
    ['/faq', t('faq')],
    ['/guides', t('guides')],
    ['/partners', t('partners')],
    ['/trainers', t('trainers')],
    ['/privacy', t('privacy')],
    ['/terms', t('terms')],
  ] as const
  return (
    <footer className="mx-auto mt-24 max-w-7xl border-t border-line px-4 py-10 sm:px-8">
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
  )
}
