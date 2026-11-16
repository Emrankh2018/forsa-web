import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import './b.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('design.gate')
  return { title: t('bName') }
}

export default function DirectionBLayout({ children }: { children: React.ReactNode }) {
  return <div className="dir-b min-h-dvh">{children}</div>
}
