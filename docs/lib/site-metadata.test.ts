import { describe, expect, it } from 'vitest'

import {
  createCaptureMetadata,
  createPageMetadata,
  createSiteMetadata,
  resolveSiteUrl,
  SITE_URL,
} from './site-metadata'

describe('site metadata', () => {
  it('uses one normalized public origin, with a server-only fallback', () => {
    expect(resolveSiteUrl()).toBe('https://react-fathom.dev')
    expect(
      resolveSiteUrl('https://public.test/path/', 'https://server.test'),
    ).toBe('https://public.test')
    expect(resolveSiteUrl(undefined, 'https://server.test/')).toBe(
      'https://server.test',
    )
    expect(() => resolveSiteUrl('ftp://site.test')).toThrow()
    expect(() => resolveSiteUrl('https://user:secret@site.test')).toThrow()
  })

  it('gives each article its own canonical and social metadata', () => {
    const page = {
      route: '/docs/react',
      title: 'React',
      description: 'React integration guide.',
    }
    const metadata = createPageMetadata(page)
    expect(metadata.title).toBe('React')
    expect(metadata.alternates?.canonical).toBe(
      new URL(page.route, SITE_URL).href,
    )
    expect(metadata.openGraph).toMatchObject({
      url: new URL(page.route, SITE_URL).href,
      title: 'React – react-fathom',
      description: page.description,
      images: [{ url: new URL('/og-image.svg', SITE_URL).href }],
    })
    expect(metadata.twitter).toMatchObject({
      title: 'React – react-fathom',
      description: page.description,
      images: [{ url: new URL('/og-image.svg', SITE_URL).href }],
    })
  })

  it('retains native root title templates, attribution, crawler rules, and social copy', () => {
    const metadata = createSiteMetadata()
    expect(metadata.title).toEqual({
      default: 'react-fathom',
      template: '%s – react-fathom',
    })
    expect(metadata.metadataBase?.toString()).toBe(new URL(SITE_URL).href)
    expect(metadata.authors).toEqual([
      { name: 'Ryan Hefner', url: 'https://github.com/ryanhefner' },
    ])
    expect(metadata.keywords).toContain('react-native')
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: { 'max-image-preview': 'large' },
    })
    expect(metadata.openGraph?.title).toBe(
      'react-fathom - Privacy-focused analytics for React',
    )
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      creator: '@ryanhefner',
    })
  })

  it('isolates capture metadata from inherited social cards', () => {
    const metadata = createCaptureMetadata('/og-image')
    expect(metadata.alternates?.canonical).toBe(
      new URL('/og-image', SITE_URL).href,
    )
    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.openGraph).toBeNull()
    expect(metadata.twitter).toBeNull()
  })
})
