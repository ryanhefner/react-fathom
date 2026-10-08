import { describe, expect, it } from 'vitest'

import { createPageMetadata, resolveSiteUrl } from './site-metadata'

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
    expect(metadata.alternates?.canonical).toBe(page.route)
    expect(metadata.openGraph).toMatchObject({
      url: page.route,
      title: 'React – react-fathom',
      description: page.description,
      images: [{ url: '/og-image.svg' }],
    })
    expect(metadata.twitter).toMatchObject({
      title: 'React – react-fathom',
      description: page.description,
      images: ['/og-image.svg'],
    })
  })
})
