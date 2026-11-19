import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { SectionHeading } from '@/components/ui/section-heading'
import { EmptyState, ErrorState, LoadingState, SuccessState } from '@/components/ui/states'
import { NotYours } from '@/components/ui/not-yours'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'statesPage' })
  return { title: t('title'), robots: { index: false, follow: false } }
}

/** The team's reference for every screen state: loading, empty, error, done, not for your account. */
export default async function StatesShowcase({ params }: PageProps<'/[locale]/showcase/states'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('statesPage')
  const block = (id: string, title: string, body: ReactNode) => (
    <section key={id} aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      <div className="mt-6">{body}</div>
    </section>
  )
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} tone="paper" />
        <div className="mx-auto mt-14 max-w-5xl space-y-16 px-4 sm:px-8">
          {block('state-loading', t('loading'), <LoadingState label={t('loadingLabel')} count={4} />)}
          {block('state-empty', t('empty'), <EmptyState title={t('emptyTitle')} body={t('emptyBody')} />)}
          {block('state-error', t('error'), <ErrorState title={t('errorTitle')} body={t('errorBody')} />)}
          {block('state-success', t('success'), <SuccessState title={t('successTitle')} body={t('successBody')} />)}
          {block('state-not-yours', t('notYours'), <NotYours />)}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
