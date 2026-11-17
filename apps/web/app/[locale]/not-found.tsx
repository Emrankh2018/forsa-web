import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'

/** A closed door: the page does not exist. Offers the way home and the three main rooms. */
export default async function NotFound() {
  const t = await getTranslations('notFound')
  const n = await getTranslations('nav')
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="mx-auto grid max-w-5xl items-end gap-10 px-4 pt-12 sm:px-8 md:grid-cols-[16rem_1fr]">
          <div>
            <Door open={0} className="h-56 w-40 md:h-72 md:w-auto" />
            <div className="floor mx-[8%] bg-line" aria-hidden="true" />
          </div>
          <div className="pb-2">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{t('body')}</p>
            <Link href="/" className="btn-arch mt-8">{t('back')}</Link>
            <p className="mt-8 text-ink-soft">{t('or')}</p>
            <ul className="-ms-3 mt-1 flex flex-wrap gap-x-2" role="list">
              <li><Link href="/projects" className="btn-quiet underline underline-offset-4">{n('projects')}</Link></li>
              <li><Link href="/learn" className="btn-quiet underline underline-offset-4">{n('learn')}</Link></li>
              <li><Link href="/partners" className="btn-quiet underline underline-offset-4">{n('partners')}</Link></li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
