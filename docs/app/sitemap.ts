import { MetadataRoute } from 'next'

import { getDocsManifest } from '@/lib/chakra-docs'

export const dynamic = 'force-static'

const SITE_URL = process.env.SITE_URL || 'https://react-fathom.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getDocsManifest()

  // Landing page
  const landingPage = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }

  // Documentation pages under /docs
  const docPages = manifest.sitemap.map((entry) => ({
    url: new URL(entry.url, SITE_URL).toString(),
    lastModified: entry.lastModified ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: entry.url === '/docs' ? 0.9 : 0.8,
  }))

  return [landingPage, ...docPages]
}
