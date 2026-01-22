import { MetadataRoute } from 'next'
import { getAllDocSlugs } from '@/lib/docs'

const SITE_URL = process.env.SITE_URL || 'https://react-fathom.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllDocSlugs()

  const docPages = slugs.map((slug) => ({
    url: slug.length === 0 ? SITE_URL : `${SITE_URL}/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug.length === 0 ? 1 : 0.8,
  }))

  return docPages
}
