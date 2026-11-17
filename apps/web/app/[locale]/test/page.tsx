import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { RoomHeader } from '@/components/ui/room-header'
import { PrototypeBand } from '@/components/flows/prototype-band'
import { TestKit } from '@/components/flows/test-kit'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('testKit')
  return { title: t('title'), robots: { index: false, follow: false } }
}

const participant = [
  ['p1', '/projects'],
  ['p2', '/workshops/cv-thirty-seconds/book'],
  ['p3', '/me/projects/cafe-launch-campaign'],
  ['p4', '/guides/cv'],
] as const
const company = [
  ['c1', '/org/new-project'],
  ['c2', '/org/projects/cafe-launch-campaign/review/p3'],
  ['c3', '/org/projects/loyalty-programme'],
] as const

/** A page to hand to testers: what to try, and a place to say where it went wrong. Not indexed. */
export default async function TestPage({ params }: PageProps<'/[locale]/test'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('testKit')
  const tasks = (list: ReadonlyArray<readonly [string, string]>) => list.map(([id, href]) => ({ id, href, text: t(`tasks.${id}` as 'tasks.p1') }))
  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <PrototypeBand />
        <RoomHeader title={t('title')} lead={t('lead')} tone="paper" />
        <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-8">
          <section aria-labelledby="how" className="border-s-4 border-maroon ps-5">
            <h2 id="how" className="font-display text-2xl font-bold">{t('howTitle')}</h2>
            <ol className="mt-3 list-decimal space-y-1 ps-5 text-lg">
              <li>{t('how1')}</li>
              <li>{t('how2')}</li>
              <li>{t('how3')}</li>
            </ol>
          </section>
          <div className="mt-14">
            <TestKit groups={[{ title: t('roleParticipant'), tasks: tasks(participant) }, { title: t('roleCompany'), tasks: tasks(company) }]} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
