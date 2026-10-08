import type { Metadata } from 'next'

export function resolveSiteUrl(publicUrl?: string, serverUrl?: string): string {
  const url = new URL(publicUrl || serverUrl || 'https://react-fathom.dev')
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error('Site URL must be an HTTP(S) URL without credentials')
  }
  return url.origin
}

export const SITE_URL = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.SITE_URL,
)

export const WITH_OSS_PAGE = {
  route: '/withoss',
  title: 'Made w/ Open-Source Software',
  description:
    'The key open-source projects behind react-fathom and its documentation site.',
} as const

export function createPageMetadata(page: {
  route: string
  title: string
  description?: string
}): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.route },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'react-fathom',
      url: page.route,
      title: `${page.title} – react-fathom`,
      description: page.description,
      images: [
        { url: '/og-image.svg', width: 1200, height: 630, alt: 'react-fathom' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@ryanhefner',
      title: `${page.title} – react-fathom`,
      description: page.description,
      images: ['/og-image.svg'],
    },
  }
}
