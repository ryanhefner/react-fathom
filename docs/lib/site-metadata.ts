import type { Metadata } from 'next'
import { defineMeta, toMetadata } from 'next-meta/app'

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

const siteDefaults = defineMeta({
  baseUrl: SITE_URL,
  siteName: 'react-fathom',
  type: 'website',
  locale: 'en_US',
  twitter: { card: 'summary_large_image', creator: '@ryanhefner' },
})

export function createSiteMetadata(): Metadata {
  return toMetadata(
    {
      title: 'react-fathom - Privacy-focused analytics for React',
      description:
        'A lightweight React integration for Fathom Analytics. Track page views and custom events while respecting user privacy.',
      canonical: '/',
      url: '/',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'react-fathom - Privacy-focused analytics for React',
        },
      ],
    },
    {
      defaults: siteDefaults,
      native: {
        title: { default: 'react-fathom', template: '%s – react-fathom' },
        description:
          'Privacy-focused analytics for React, Next.js, and React Native. A lightweight integration for Fathom Analytics with support for React Router, Gatsby, and TanStack Router.',
        keywords: [
          'react',
          'fathom',
          'analytics',
          'privacy',
          'nextjs',
          'react-native',
          'react-router',
          'gatsby',
          'tanstack-router',
          'gdpr',
          'ccpa',
          'cookie-free',
        ],
        authors: [
          { name: 'Ryan Hefner', url: 'https://github.com/ryanhefner' },
        ],
        creator: 'Ryan Hefner',
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
      },
    },
  )
}

export function createCaptureMetadata(path: string): Metadata {
  return toMetadata(
    { title: 'Open Graph image', baseUrl: SITE_URL, canonical: path },
    {
      native: {
        robots: { index: false, follow: false },
        openGraph: null,
        twitter: null,
      },
    },
  )
}

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
  return toMetadata(
    {
      title: `${page.title} – react-fathom`,
      description: page.description,
      canonical: page.route,
      url: page.route,
      images: [
        { url: '/og-image.svg', width: 1200, height: 630, alt: 'react-fathom' },
      ],
    },
    { defaults: siteDefaults, native: { title: page.title } },
  )
}
