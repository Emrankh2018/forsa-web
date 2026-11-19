import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { sampleRecord } from '@forsa/shared/seed/app'
import { Link } from '@/i18n/navigation'
import { formatters } from '@/lib/format'
import { ProfileForm } from '@/components/more/forms'

/** The participant's profile: what companies see, and what the public record shows. */
export default async function ProfilePage({ params }: PageProps<'/[locale]/me/profile'>) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('profile')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <ProfileForm
          initial={{ headline: f.pick(sampleRecord.headline), skills: sampleRecord.skills.map(f.pick).join('\n') }}
          publicLink={<Link href={`/p/${sampleRecord.handle}`} className="btn-quiet -ms-3 underline underline-offset-4">{t('seePublic')}</Link>}
        />
      </div>
    </>
  )
}
