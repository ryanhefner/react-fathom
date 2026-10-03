import { describe, expect, it, vi } from 'vitest'

import { OG_IMAGE_DEFAULTS } from './og-image'
import { WITH_OSS_PAGE } from './site-metadata'
import {
  createSocialImageMetadata,
  getSocialImagePage,
  getSocialImagePages,
} from './social-image'
import {
  generateMetadata as docsMetadata,
  generateStaticParams as docsParams,
  default as DocPage,
} from '../app/docs/[[...slug]]/page'
import {
  generateStaticParams as captureParams,
  default as CapturePage,
} from '../app/og-image/[...slug]/page'

const pages = vi.hoisted(() =>
  [
    { route: '/docs', title: 'Introduction', description: 'Start here.' },
    {
      route: '/docs/react',
      title: 'React',
      description: 'Analytics in React.',
    },
    { route: '/docs/next/app-router', title: 'App Router' },
    { route: '/docs/draft', title: 'Private draft', draft: true },
    { route: '/docs/hidden', title: 'Hidden page', hidden: true },
  ].map((page) => ({
    ...page,
    id: page.route,
    slug: page.route.split('/').filter(Boolean).slice(1),
    path: `${page.route}.mdx`,
    frontmatter: { draft: page.draft, hidden: page.hidden },
  })),
)

vi.mock('./chakra-docs', () => ({
  getDocsManifest: async () => ({
    pages,
    byRoute: Object.fromEntries(pages.map((page) => [page.route, page])),
  }),
}))
vi.mock('@/components/docs', () => ({ DocsLayout: () => null }))
vi.mock('@/components/docs/DocsMarkdown', () => ({ DocsMarkdown: () => null }))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND')
  },
}))

describe('generated social-image routes', () => {
  it('uses published page metadata, with root and OSS captures but no private pages', async () => {
    expect((await getSocialImagePages()).map((page) => page.route)).toEqual([
      '/',
      '/withoss',
      '/docs',
      '/docs/react',
      '/docs/next/app-router',
    ])
    expect(await getSocialImagePage('/')).toEqual({
      route: '/',
      ...OG_IMAGE_DEFAULTS,
    })
    expect(await getSocialImagePage('/withoss')).toEqual(WITH_OSS_PAGE)
    expect(await getSocialImagePage('/docs/react')).toEqual({
      route: '/docs/react',
      title: 'React',
      description: 'Analytics in React.',
    })
    expect(await getSocialImagePage('/docs/next/app-router')).toMatchObject({
      description: OG_IMAGE_DEFAULTS.description,
    })
    expect(await getSocialImagePage('/missing')).toBeUndefined()
  })

  it('exports one social-image route for every exported docs page, including the index and nested pages', async () => {
    expect(await docsParams()).toEqual([
      { slug: [] },
      { slug: ['react'] },
      { slug: ['next', 'app-router'] },
      { slug: ['social-image'] },
      { slug: ['react', 'social-image'] },
      { slug: ['next', 'app-router', 'social-image'] },
    ])
    expect(await captureParams()).toEqual([
      { slug: ['withoss'] },
      { slug: ['docs'] },
      { slug: ['docs', 'react'] },
      { slug: ['docs', 'next', 'app-router'] },
    ])
  })

  it('passes matching defaults to the shared capture component and rejects unavailable pages', async () => {
    const alias = await DocPage({
      params: Promise.resolve({ slug: ['react', 'social-image'] }),
    })
    const direct = await CapturePage({
      params: Promise.resolve({ slug: ['docs', 'react'] }),
    })
    expect(alias.type).toBe(direct.type)
    expect(alias.props.defaults).toMatchObject({
      title: 'React',
      description: 'Analytics in React.',
    })
    expect(direct.props.defaults).toMatchObject(alias.props.defaults)
    for (const slug of [['missing'], ['draft'], ['hidden']]) {
      await expect(
        DocPage({
          params: Promise.resolve({ slug: [...slug, 'social-image'] }),
        }),
      ).rejects.toThrow('NOT_FOUND')
      await expect(
        CapturePage({
          params: Promise.resolve({ slug: ['docs', ...slug] }),
        }),
      ).rejects.toThrow('NOT_FOUND')
    }
  })

  it('marks templates noindex and retains normal page metadata and existing image URLs', async () => {
    expect(createSocialImageMetadata('/')).toMatchObject({
      alternates: { canonical: '/social-image' },
      robots: { index: false, follow: false },
    })
    expect(
      await docsMetadata({
        params: Promise.resolve({ slug: ['react', 'social-image'] }),
      }),
    ).toMatchObject({
      alternates: { canonical: '/docs/react/social-image' },
      robots: { index: false, follow: false },
    })
    expect(
      await docsMetadata({
        params: Promise.resolve({ slug: ['react'] }),
      }),
    ).toMatchObject({
      title: 'React',
      alternates: { canonical: '/docs/react' },
      openGraph: { images: [{ url: '/og-image.svg' }] },
    })
  })
})
