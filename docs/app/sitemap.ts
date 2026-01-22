import { MetadataRoute } from 'next'
import { getAllDocSlugs } from '@/lib/docs'

const SITE_URL = process.env.SITE_URL || 'https://react-fathom.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllDocSlugs()

  // Landing page
  const landingPage = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }

  // Documentation pages under /docs
  const docPages = slugs.map((slug) => ({
    url: slug.length === 0 ? `${SITE_URL}/docs` : `${SITE_URL}/docs/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug.length === 0 ? 0.9 : 0.8,
  }))

  return [landingPage, ...docPages]
}
