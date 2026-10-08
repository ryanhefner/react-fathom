import { describe, expect, it, vi } from 'vitest'

import { getDocsManifest } from './chakra-docs'
import { createSiteLlmsText } from './llms'
import { SITE_URL } from './site-metadata'
import { GET as getFull } from '../app/llms-full.txt/route'
import { GET as getIndex, dynamic } from '../app/llms.txt/route'

vi.mock('./chakra-docs', async () => {
  const { createDocsManifest } = await import('@chakra-docs/core')
  const page = {
    id: 'docs:setup',
    collectionId: 'docs',
    slug: ['setup'],
    path: 'setup.mdx',
    route: '/docs/setup',
    title: 'Setup',
    description: 'Install and configure analytics.',
    frontmatter: {},
    body: '## Install\n\n```sh\nnpm install react-fathom\n```',
  }
  const manifest = createDocsManifest({
    collections: [
      { id: 'docs', name: 'Documentation', pages: [page], nav: [] },
    ],
  })
  return { getDocsManifest: async () => manifest }
})

describe('LLM documentation', () => {
  it('exports text routes containing every published page and its source content', async () => {
    const manifest = await getDocsManifest()
    const indexResponse = await getIndex()
    const fullResponse = await getFull()
    expect(dynamic).toBe('force-static')
    for (const response of [indexResponse, fullResponse]) {
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe(
        'text/plain; charset=utf-8',
      )
      expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    }
    const index = await indexResponse.text()
    const full = await fullResponse.text()
    expect(index).toMatch(/^# react-fathom\n/)
    expect(index).toContain(`${SITE_URL}/llms-full.txt`)
    const published = manifest.pages.filter(
      (page) => !page.frontmatter.draft && !page.frontmatter.hidden,
    )
    expect(published.length).toBeGreaterThan(0)
    for (const page of published) {
      expect(index).toContain(`](${SITE_URL}${page.route})`)
      expect(full).toContain(`Source: ${SITE_URL}${page.route}`)
      expect(full).toContain(page.body?.trim())
    }
  })

  it('never exposes draft or hidden documentation', async () => {
    const manifest = await getDocsManifest()
    const privatePages = ['draft', 'hidden'].map((flag) => ({
      ...manifest.pages[0],
      id: flag,
      route: `/docs/${flag}`,
      frontmatter: { [flag]: true },
      body: `private-${flag}-body`,
    }))
    for (const full of [false, true]) {
      const text = createSiteLlmsText(
        { ...manifest, pages: [...manifest.pages, ...privatePages] },
        SITE_URL,
        full,
      )
      expect(text).not.toMatch(
        /private-(draft|hidden)-body|\/docs\/(draft|hidden)/,
      )
    }
  })
})
