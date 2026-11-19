import type { MetadataRoute } from 'next'
import { listCourses, listGuides, listProjects, listWorkshops } from '@/lib/data'
import { siteUrl } from '@/lib/site'

const staticPaths = ['', '/projects', '/learn', '/workshops', '/sessions', '/courses', '/guides', '/partners', '/trainers', '/about', '/faq', '/contact', '/privacy', '/terms']

/**
 * Every public page in both languages, each naming its twin. Projects, workshops, courses and guides
 * come through the data seam, so the list follows the real ones once the database is live.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, workshops, courses, guides] = await Promise.all([listProjects(), listWorkshops(), listCourses(), listGuides()])
  const paths = [
    ...staticPaths,
    ...projects.map((p) => `/projects/${p.slug}`),
    ...workshops.map((w) => `/workshops/${w.slug}`),
    ...courses.map((c) => `/courses/${c.slug}`),
    ...guides.map((g) => `/guides/${g.slug}`),
  ]
  return paths.flatMap((path) =>
    (['ar', 'en'] as const).map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      alternates: { languages: { ar: `${siteUrl}/ar${path}`, en: `${siteUrl}/en${path}` } },
      changeFrequency: path === '' || path === '/projects' || path === '/workshops' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.6,
    })),
  )
}
