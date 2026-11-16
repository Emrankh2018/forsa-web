import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import './a.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('design.gate')
  return { title: t('aName') }
}

export default function DirectionALayout({ children }: { children: React.ReactNode }) {
  return <div className="dir-a min-h-dvh">{children}</div>
}
