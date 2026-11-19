import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { formatters } from '@/lib/format'
import { TrainerProfileForm } from '@/components/more/forms'
import { getTrainer, getTrainerProfile } from '@/lib/data'

export default async function TrainerProfile({ params }: PageProps<'/[locale]/trainer/profile'>) {
  const sampleTrainer = await getTrainer()
  const sampleTrainerProfile = await getTrainerProfile()
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)
  const t = await getTranslations('trainerProfile')
  const f = formatters(locale)
  return (
    <>
      <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">{t('lead')}</p>
      <div className="mt-10">
        <TrainerProfileForm name={f.pick(sampleTrainer.name)} initial={{ expertise: f.pick(sampleTrainerProfile.expertise), bio: f.pick(sampleTrainerProfile.bio) }} />
      </div>
    </>
  )
}
