import { getTranslations } from 'next-intl/server'
export { safeReturnPath } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Door } from '@/components/site/door'

/** Sign-in and join until phase 3: an honest closed door, and a way back to where you were. */
export async function AccountsSoon({ title, next }: { title: string; next: string | null }) {
  const t = await getTranslations('account')
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="mx-auto grid max-w-5xl items-end gap-10 px-4 pt-12 sm:px-8 md:grid-cols-[16rem_1fr]">
          <Door open={6} className="h-56 w-40 md:h-72 md:w-auto" />
          <div className="pb-2">
            <p className="text-ink-soft">{title}</p>
            <h1 className="font-display mt-2 text-4xl font-bold sm:text-5xl">{t('soonTitle')}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">{t('soonBody')}</p>
            <p className="mt-2 max-w-xl text-ink-soft">{t('returnNote')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {next ? <Link href={next} className="btn-arch">{t('backTo')}</Link> : null}
              <Link href="/projects" className={next ? 'btn-quiet underline underline-offset-4' : 'btn-arch'}>{t('browse')}</Link>
            </div>
            <p className="mt-10 text-ink-soft">{t('orgNote')}</p>
            <Link href="/partners" className="btn-quiet -ms-3 underline underline-offset-4">{t('orgCta')}</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
