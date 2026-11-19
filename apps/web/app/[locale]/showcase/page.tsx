import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@forsa/shared'
import { SiteHeader } from '@/components/site/header'
import { Door } from '@/components/site/door'
import { SectionHeading } from '@/components/ui/section-heading'
import { CheckboxGroup, SelectField, TextArea, TextField } from '@/components/ui/field'
import { EmptyState, ErrorState, LoadingState, SuccessState, Tag } from '@/components/ui/states'
import { SignInPrompt } from '@/components/ui/sign-in-prompt'
import { RoomHeader } from '@/components/ui/room-header'
import { localeOf, type MetaProps } from '@/lib/locale-param'

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'showcase' })
  return { title: t('title'), robots: { index: false, follow: false } }
}

/** Every shared component in every state, for review in both languages and directions. */
export default async function Showcase({ params }: PageProps<'/[locale]/showcase'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('showcase')
  const u = await getTranslations('ui')
  const s = await getTranslations('signInPrompt')
  const cities = t('cities').split('|').map((c) => ({ value: c, label: c }))
  const interests = (['interestA', 'interestB', 'interestC', 'interestD'] as const).map((k) => ({ value: k, label: t(k) }))

  return (
    <>
      <SiteHeader />
      <main id="content" tabIndex={-1} className="outline-none">
        <RoomHeader title={t('title')} lead={t('lead')} />
        <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-8">
          <section aria-labelledby="sc-buttons">
            <SectionHeading id="sc-buttons">{t('buttons')}</SectionHeading>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="button" className="btn-arch">{t('primary')}</button>
              <button type="button" className="btn-quiet underline underline-offset-4">{t('quiet')}</button>
              <button type="button" className="btn-arch" aria-disabled="true" disabled>{t('disabled')}</button>
              <span className="inline-flex bg-night p-4"><button type="button" className="btn-arch btn-arch--sand">{t('sand')}</button></span>
            </div>
          </section>

          <section aria-labelledby="sc-doors">
            <SectionHeading id="sc-doors">{t('doors')}</SectionHeading>
            <p className="mt-4 max-w-2xl text-ink-soft">{t('doorsLine')}</p>
            <ul className="mt-6 grid max-w-2xl grid-cols-3 gap-6" role="list">
              {([['closed', 0], ['ajar', 40], ['wide', 80]] as const).map(([k, open]) => (
                <li key={k}>
                  <Door open={open} className="h-40" />
                  <p className="mt-3 text-sm font-medium">{t(k)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sc-fields" className="max-w-2xl">
            <SectionHeading id="sc-fields">{t('fields')}</SectionHeading>
            <div className="mt-6 space-y-6">
              <TextField id="sc-name" label={t('name')} hint={t('nameHint')} required requiredLabel={u('required')} autoComplete="name" />
              <TextField id="sc-email" label={t('email')} type="email" defaultValue="name@" error={t('emailError')} required requiredLabel={u('required')} />
              <SelectField id="sc-city" label={t('city')} options={cities} />
              <TextArea id="sc-message" label={t('message')} />
              <CheckboxGroup id="sc-interests" legend={t('interests')} options={interests} values={['interestB']} />
              <button type="button" className="btn-arch">{t('send')}</button>
            </div>
          </section>

          <section aria-labelledby="sc-states">
            <SectionHeading id="sc-states">{t('states')}</SectionHeading>
            <div className="mt-6 space-y-10">
              <div>
                <h3 className="mb-4 font-medium">{t('loadingTitle')}</h3>
                <LoadingState label={u('loading')} count={4} />
              </div>
              <EmptyState title={t('emptyTitle')} body={t('emptyBody')} action={<button type="button" className="btn-quiet -ms-3 underline underline-offset-4">{t('emptyAction')}</button>} />
              <ErrorState title={t('errorTitle')} body={t('errorBody')} action={<button type="button" className="btn-quiet -ms-3 underline underline-offset-4">{u('tryAgain')}</button>} />
              <SuccessState title={t('successTitle')} body={t('successBody')} />
            </div>
          </section>

          <section aria-labelledby="sc-tags">
            <SectionHeading id="sc-tags">{t('tags')}</SectionHeading>
            <div className="mt-6 flex flex-wrap gap-3">
              <Tag>{t('tagPlain')}</Tag>
              <Tag tone="accent">{t('tagAccent')}</Tag>
            </div>
          </section>

          <section aria-labelledby="sc-dialog" className="max-w-xs">
            <SectionHeading id="sc-dialog">{t('dialog')}</SectionHeading>
            <div className="mt-6">
              <SignInPrompt label={t('primary')} returnTo="/showcase" title={s('title')} body={s('body')} continueLabel={s('continue')} notNowLabel={s('notNow')} />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
