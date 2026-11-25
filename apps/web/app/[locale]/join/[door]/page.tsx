import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeReturnPath, type Locale } from '@forsa/shared'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { SiteHeader } from '@/components/site/header'
import { PrototypeBand } from '@/components/flows/prototype-band'
import { Onboarding } from '@/components/flows/onboarding'
import { OrgRegistration, TrainerApplication } from '@/components/flows/org-and-trainer'
import { fields } from '@/lib/data'

const doors = ['participant', 'organisation', 'trainer'] as const

export function generateStaticParams() {
  return doors.map((door) => ({ door }))
}

export async function generateMetadata(): Promise<Metadata> {
  return { robots: { index: false, follow: false } }
}

/** Behind each door of "Come in": onboarding, organisation registration, trainer application. */
export default async function JoinDoor({ params, searchParams }: PageProps<'/[locale]/join/[door]'>) {
  const { locale: raw, door } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  if (!doors.includes(door as (typeof doors)[number])) notFound()
  const next = safeReturnPath((await searchParams).next)
  const query = next ? { next } : undefined
  const a = await getTranslations('account')
  const ob = await getTranslations('onboarding')
  const org = await getTranslations('orgReg')
  const tr = await getTranslations('trainerApp')
  const f = formatters(locale)
  const title = door === 'participant' ? ob('title') : door === 'organisation' ? org('title') : tr('title')
  const lead = door === 'organisation' ? org('lead') : door === 'trainer' ? tr('lead') : null

  return (
    <>
      <SiteHeader query={query} />
      <main id="content" tabIndex={-1} className="outline-none">
        <PrototypeBand />
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-8">
          <Link href={{ pathname: '/join', query: { as: door, ...query } }} className="btn-quiet -ms-3 text-ink-soft underline underline-offset-4">{a('chooseTitle')}</Link>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">{title}</h1>
          <div className="first-line mt-4 max-w-sm" aria-hidden="true" />
          {lead ? <p className="mt-5 max-w-2xl text-lg text-ink-soft">{lead}</p> : null}
          <div className="mt-10">
            {door === 'participant' ? (
              <Onboarding fieldOptions={Object.entries(fields).map(([value, label]) => ({ value, label: f.pick(label) }))} stepNumbers={[1, 2, 3, 4].map(f.num)} next={next} />
            ) : door === 'organisation' ? (
              <OrgRegistration next={next} />
            ) : (
              <TrainerApplication next={next} />
            )}
          </div>
        </section>
      </main>
    </>
  )
}
